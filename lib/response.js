/**
 * Module dependencies.
 */
const Emitter = require('events');

/**
 * Expose `Response` class.
 * Inherits from `Emitter.prototype`.
 */
module.exports = class Response extends Emitter {
  set text (text) {
    this._text = text;
  }

  get text () {
    return this._text;
  }

  onerror (err) {
    this.emit('error', err);
  }

  end () {
    this.emit('end', this);
  }
};
