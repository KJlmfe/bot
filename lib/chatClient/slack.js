/**
 * Module dependencies.
 */
const Emitter = require('events');
const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

/**
 * Expose `Slack` class.
 * Inherits from `Emitter.prototype`.
 */
module.exports = class Slack extends Emitter {
  /**
   * Initialize a new `Slack`.
   *
   * @param  {String} token  Slack bot user token
   * @api public
   */
  constructor (token) {
    super();
    this.rtm = new RtmClient(token);
    this.rtm.on(RTM_EVENTS.MESSAGE, this.onMessage.bind(this));
    this.rtm.start();
  }

  /**
   * Receive the message from slack server
   *
   * @param  {Object} message  Slack message
   * @api public
   */
  onMessage (message) {
    const channel = message.channel;
    if (message.user === 'U4RTZM3QU') return;

    this.emit('message', message, this.sendMessage.bind(this, channel));
  }

  /**
   * Send the message to slack server
   *
   * @param  {String}  channel
   * @param  {Error}   err
   * @param  {Context} context
   * @api private
   */
  sendMessage (channel, err, context) {
    const reply = context.reply;
    if (err) {
      this.rtm.sendMessage(`Oops, an error occurred! ${err.message}`, channel);
    } else {
      this.rtm.sendMessage(reply.text, channel);
    }
  }
};
