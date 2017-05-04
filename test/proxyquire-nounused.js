'use strict';
/*jshint asi:true*/
/*global describe, before, beforeEach, it */

var assert = require('assert')
  , proxyquire = require('..')
  , path = require('path')
  , fooPath = path.join(__dirname, './samples/notexisting/foo.js')

describe('When resolving something unused', function () {

  it('throws error if stubs is not used', function () {
    assert.throws(function () {
      proxyquire.noUnusedStubs().load(fooPath, {
        '/not/existing/bar.json': { config: 'bar\'s config', '@noCallThru': true },
        '/not/used/thing': { a: 'b' }
      })
    });
  })
})
