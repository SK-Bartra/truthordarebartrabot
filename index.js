const TelegramApi = require('node-telegram-bot-api');
const token = '5470988261:AAFRfk8pMzCDV0dSq9SXDnhxL5M3DobDKu8';
const bot = new TelegramApi(token, { polling: true });

const { gameOptions, againOptions } = require('./options');

const chats = {};

//test

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Сейчас й загадаю цифру от 0 до 9, а ты должен её отгадать!`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Отгадывай...`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
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
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!');
  });

  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again') {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Увы, ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
