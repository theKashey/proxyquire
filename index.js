'use strict';

/**
 * @type {Proxyquire}
 */
var _Proxyquire = require('./lib/proxyquire');

// delete this module from the cache to force re-require in order to allow resolving test module via parent.module
delete require.cache[require.resolve(__filename)];

module.exports = new _Proxyquire(module.parent);
module.exports.compat = function() {
  throw new Error("Proxyquire compat mode has been removed. Please update your code to use the new API or pin the version in your package.json file to ~0.6");
};