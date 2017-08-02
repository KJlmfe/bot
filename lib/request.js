/**
 * Expose `Request` class.
 */
module.exports = class Request {
  set text (text) {
    this._text = text;
  }

  get text () {
    return this._text;
  }
};
