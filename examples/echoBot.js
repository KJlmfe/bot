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
 * @param  {Request}  req
 * @param  {Response} res
 */
bot.use((req, res) => {
  res.text = `I got your message: ${req.text}`;
});

slackChatClient.on('message', (req, res) => {
  bot.hears(req, res);
});
