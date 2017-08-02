/**
 * Module dependencies.
 */
const Emitter = require('events');
const RtmClient = require('@slack/client').RtmClient;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS;
const Response = require('../response');
const Request = require('../request');

/**
 * Expose `Slack` class.
 * Inherits from `Emitter.prototype`.
 */
module.exports = class Slack extends Emitter {
  /**
   * Initialize a new `Slack`.
   *
   * @param  {string} token  Slack bot user token
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
    const req = this.createRequest(message);
    const res = this.createResponse(channel);

    this.emit('message', req, res);
  }

  /**
   * create a request object based on slack message
   *
   * @param  {Object} message  Slack message
   * @return {Request}
   * @api private
   */
  createRequest (message) {
    const req = new Request();
    req.text = message.text;

    return req;
  }

  /**
   * create a response object
   *
   * @param  {string} channel  the channle corresponded to the response
   * @return {Response}
   * @api private
   */
  createResponse (channel) {
    const res = new Response();

    res.on('end', () => {
      this.rtm.sendMessage(res.text, channel);
    });

    res.on('error', (err) => {
      this.rtm.sendMessage(`Oops, an error occurred! ${err.message}`, channel);
    });

    return res;
  }
};
