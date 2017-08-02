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
   * Entry to handle request and response
   *
   * @param  {Request}  req
   * @param  {Response} res
   * @return {Promise}
   * @api public
   */
  hears (req, res) {
    const fn = compose(this.middleware);
    const onerror = err => res.onerror(err);
    const handleResponse = () => res.end();

    return fn(req, res).then(handleResponse).catch(onerror);
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
   * @param  {Request}   req
   * @param  {Response}  res
   * @param  {Function}  next
   * @return {Promise}
   * @api public
   */
  return function (req, res, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);

    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));

      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();

      try {
        return Promise.resolve(fn(req, res, function next () {
          return dispatch(i + 1);
        }));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
