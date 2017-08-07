/**
 * Module dependencies.
 */
const Slack = require('../lib/chatClient/slack');
const Bot = require('../lib/bot');

const slackBotToken = process.argv[2];
if (!slackBotToken) {
  throw Error('Missing slack bot token parameter');
}

const slackChatClient = new Slack(slackBotToken);
const bot = new Bot();

/**
 * add a middleware to reply same text sent by user
 *
 * @param  {Context}   context
 * @param  {Function}  next
 */
bot.use((context, next) => {
  context.reply.text = `I got your message: ${context.message.text}`;
  next();
});

slackChatClient.on('message', (message, callback) => {
  bot.hears(message).then((context) => {
    callback(null, context);
  }).catch((err, context) => {
    callback(err, context);
  });
});
