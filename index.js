const TelegramApi = require('node-telegram-bot-api');
const token = '5470988261:AAFRfk8pMzCDV0dSq9SXDnhxL5M3DobDKu8';
const bot = new TelegramApi(token, { polling: true });
const sequelize = require('./db');
const ChatModel = require('./models/ChatModel');
const QuestionModel = require('./models/QuestionModel');
const ActionModel = require('./models/ActionModel');
const { CALLBACK_CODE } = require('./constants');

const {
  gameOptions,
  againOptions,
  truthOrDareOptions,
  addTruthOrDareOptions,
} = require('./options');

const chats = {};
const waiting = [];

// вспомогательные

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас й загадаю цифру от 0 до 9, а ты должен её отгадать!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Отгадывай...`, gameOptions);
};

const addItem = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `🔑 Ты хочешь добавить новый вопрос или новую задачу?`,
    addTruthOrDareOptions
  );
};

const addAction = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Напиши новую задачу, например: "Позвони в пиццерию и закажи пиццу на Марс!"`
  );
  waiting.push({
    chatId,
    type: CALLBACK_CODE.ADD_ACTION,
  });
};

const addQuestion = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Напиши новый вопрос, например: "Куда ты засовывал шпаргалки?"`
  );
  waiting.push({
    chatId,
    type: CALLBACK_CODE.ADD_QUESTION,
  });
};

// главный луп

const start = async () => {
  //
  // проверка подключения к БД
  //
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.log('Аутентификация в БД сломалась, ошибка: \n ', error);
  }
  try {
    await sequelize.sync({ alter: true }); // синхронизация моделей в коде с таблицами в БД
  } catch (error) {
    console.log('Синхронизация моделей в БД сломалась, ошибка: \n ', error);
  }

  //
  // инициализация списка комманд
  //
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
  ]);

  //
  // реакция на сообщения
  //
  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    // const username = msg.from.username;

    try {
      if (waiting.find((el) => el.chatId === chatId)) {
        // закрытая ветка (ожидание определённых ответов)

        console.log('\n\nwaiting not empty....\n\n', waiting);

        if (waiting.find((el) => el.type === CALLBACK_CODE.ADD_ACTION)) {
          console.log('\n\nadding new action....\n\n');
          const addedItem = await ActionModel.create({ text: msg.text });
          await addedItem.save();
          console.log('added new item to database: \n', addedItem);
        }

        if (waiting.find((el) => el.type === CALLBACK_CODE.ADD_QUESTION)) {
          console.log('\n\nadding new question....\n\n');
          const addedItem = await QuestionModel.create({ text: msg.text });
          await addedItem.save();
          console.log('added new item to database: \n', addedItem);
        }

        // Send reply
        //bot.sendMessage(chatId, 'Добавляем это? \n\n ' + msg.text);

        // Убираем из списка ожидания
        waiting.splice(
          waiting.findIndex((el) => el.chatId === chatId),
          1
        );
      } else {
        // открытая ветка (основные действия)
        if (text === '/start') {
          const chat = await ChatModel.findOne({ chatId });
          if (!chat) {
            await ChatModel.create({ chatId }); // вот здесь ошибка возникает
          }

          await bot.sendSticker(
            chatId,
            'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/12.webp'
          );
          return bot.sendMessage(
            chatId,
            `Добро пожаловать в игру, я телеграм бот для игры в "Правда или Действие"`
          );
        }

        if (text === '/info') {
          const chat = await ChatModel.findOne({ chatId }); // вот тут вытаскиваем запись
          return bot.sendMessage(
            chatId,
            `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}. В игре у тебя правильных ответов ${chat.right}, неправильных ${chat.wrong}`
          );
        }

        if (text === '/game') {
          return startGame(chatId);
        }

        if (text === '/add_item') {
          return addItem(chatId);
        }

        if (text === '/print_chat_id') {
          await bot.sendMessage(chatId, `Хз что это: ${msg.from.id}`);
          return bot.sendMessage(chatId, `Номер чата: ${msg.chat.id}`);
        }

        // return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!');
        return;
      }
    } catch (error) {
      console.log(error);
      return bot.sendMessage(chatId, `Упс, ошибочка вышла!`);
    }
  });

  // реакция на кнопки

  bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === CALLBACK_CODE.ADD_ACTION) {
      return addAction(chatId);
    }

    if (data === CALLBACK_CODE.ADD_QUESTION) {
      return addQuestion(chatId);
    }

    if (data === '/again') {
      return startGame(chatId);
    }

    const chat = await ChatModel.findOne({ chatId }); // и тут вытаскиваем запись

    if (data == chats[chatId]) {
      chat.right += 1;
      await bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      chat.wrong += 1;
      await bot.sendMessage(
        chatId,
        `Увы, ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
    await chat.save(); // вот тут сохраняется изменённое значение в таблицу
  });
};

// инициализация

start();
