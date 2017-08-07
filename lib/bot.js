/**
 * Module dependencies.
 */
const context = require('./context');

/**
 * Expose `Bot` class.
 */
module.exports = class Bot {
  /**
   * Initialze a new `Bot`.
   *
   * @api public
   */
  constructor () {
    this.middleware = [];

    this.context = Object.create(context);
  }

  /**
   * Use the given middleware `fn`.
   *
   * @param  {Function} fn
   * @return {Bot}      self
   * @api public
   */
  use (fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');

    this.middleware.push(fn);
    return this;
  }

  /**
   * Initialize a new context.
   *
   * @api private
   */
  createContext (message) {
    const context = Object.create(this.context);

    context.message = message;
    context.reply = {};

    return context;
  }

  /**
   * Entry to handle message
   *
   * @param  {Object}  message
   * @return {Promise}
   * @api public
   */
  hears (message) {
    const context = this.createContext(message);
    const fn = compose(this.middleware);

    return new Promise((resolve, reject) => {
      fn(context, (err) => {
        return err ? reject(err, context) : resolve(context);
      });
    });
  }
};

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param  {Array} middleware
 * @return {Function}
 * @api private
 */
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!');

  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!');
  }

  /**
   * @param  {Context}   context
   * @param  {Function}  next
   * @api public
   */
  return function (context, next) {
    return dispatch(0);

    function dispatch (i) {
      if (i === middleware.length) { // all middlewares have been finished
        return next();
      }
      let fn = middleware[i];
      let over = false;

      fn(context, (err) => {
        if (over) {
          throw new Error('next() called multiple times');
        }
        over = true;
        // Stop immediately, if a middleware occurs error,
        return err ? next(err) : dispatch(i + 1);
      });
    }
  };
}
