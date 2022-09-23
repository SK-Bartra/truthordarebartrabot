const { CALLBACK_CODE } = require('./constants');

module.exports = {
  gameOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: '1', callback_data: '1' },
          { text: '2', callback_data: '2' },
          { text: '3', callback_data: '3' },
        ],
        [
          { text: '4', callback_data: '4' },
          { text: '5', callback_data: '5' },
          { text: '6', callback_data: '6' },
        ],
        [
          { text: '7', callback_data: '7' },
          { text: '8', callback_data: '8' },
          { text: '9', callback_data: '9' },
        ],
        [{ text: '0', callback_data: '0' }],
      ],
    }),
  },
  againOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [[{ text: 'Играть ещё раз', callback_data: '/again' }]],
    }),
  },
  truthOrDareOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: '😇 ПРАВДА', callback_data: CALLBACK_CODE.TRUTH },
          { text: '😈 ДЕЙСТВИЕ', callback_data: CALLBACK_CODE.DARE },
        ],
      ],
    }),
  },
  addTruthOrDareOptions: {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: '😇 Добавить вопрос',
            callback_data: CALLBACK_CODE.ADD_QUESTION,
          },
          {
            text: '😈 Добавить задачу',
            callback_data: CALLBACK_CODE.ADD_ACTION,
          },
        ],
      ],
    }),
  },
};
