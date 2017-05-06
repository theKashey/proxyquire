/*jshint asi:true*/
/*global describe, before, beforeEach, it */
'use strict';

var realFoo = require('./samples/foo')
  , Module = require('module');

var assert = require('assert')
  , path = require('path');


var stubs = {
  'samples/foo': {},
  'samples/bar': {
    rab: function () {
      return 'resolved'
    }
  },
  '/sub.js': {
    subFn: function () {
      return 'override';
    },
    '@override': true
  }
};


function keyResolver(stubs, fileName, module) {
  var dirname = module ? path.dirname(module) : '';
  var requireName = fileName;
  if (dirname) {
    requireName = fileName.charAt(0) == '.' ? path.normalize(dirname + '/' + fileName) : fileName;
  }

  for (var i in stubs) {
    if (requireName.indexOf(i) > 0) {
      return {
        key: i,
        stub: stubs[i]
      };
    }
  }
}

function resolver(stubs, fileName, module) {
  var result = keyResolver(stubs, fileName, module);
  return result ? result.stub : undefined;
}

function cloneObject(object) {
  if (Object.assign) {
    return Object.assign({}, object);
  }
  var result = {};
  for (var i in object) {
    if (object.hasOwnProperty(i)) {
      result[i] = object[i];
    }
  }
  return result;
}

function wipeCache(stubs, resolver, testCallback) {
  if (!testCallback) {
    testCallback = function () {
      return true;
    }
  }
  var wipeList = [];
  var removedList = [];
  var newCache = cloneObject(require.cache);
  var objects = Object.keys(newCache);
  objects.forEach(function (moduleName) {
    var test = resolver(stubs, moduleName);
    if (test) {
      wipeList.push(moduleName);
      removedList.push(moduleName);
      delete newCache[moduleName];
    }
  });

  while (wipeList.length) {
    var objects = Object.keys(newCache);
    var removeList = wipeList;
    wipeList = [];

    objects.forEach(function (moduleName) {
      if (testCallback(moduleName)) {
        var subCache = newCache[moduleName].children;
        subCache.forEach(function (subModule) {
          if (removeList.indexOf(subModule.filename) >= 0) {
            wipeList.push(moduleName);
            removedList.push(moduleName);
            delete newCache[moduleName];
          }
        });
      }
    });
  }

  require.cache = Module._cache = newCache;
}

function wipe() {
  wipeCache(stubs, resolver, function (moduleName) {
    return moduleName.indexOf('/samples/') > 0;
  });
}

describe('nameresolver', function () {
  describe('override', function () {
    var proxyquire = require('..')

    it('proxyquire can load module buy half name', function () {
      require('./samples/foo');
      var proxiedFoo = proxyquire.resolveNames(keyResolver).load('./samples/foo', stubs);

      assert.equal(proxiedFoo.testSub(), 'sub');
      assert.equal(proxiedFoo.bigRab(), 'RESOLVED');
    });

    it('proxyquire can override deep module ', function () {
      var foo = require('./samples/foo');
      assert.equal(foo.testSub(), 'sub');
      wipe();
      var proxiedFoo = proxyquire.resolveNames(keyResolver).load('./samples/foo', {
        '/sub.js': {
          subFn: function () {
            return 'override';
          },
          '@override': true
        }
      });
      assert.equal(proxiedFoo.testSub(), 'override');
      assert.equal(proxiedFoo.bigRab(), 'RAB');
    });


    it('proxyquire can override deep module via overriden module', function () {
      wipe();
      var proxiedFoo = proxyquire.resolveNames(keyResolver).callThru().load('./samples/foo', {
        'samples/bar': {
          rab: function () {
            return 'resolved'
          }
        },
        '/sub.js': { // sub.js included in bar.js, included in foo.js. Ie required by third-party module
          subFn: function () {
            return 'override';
          },
          '@override': true
        }
      });
      assert.equal(proxiedFoo.testSub(), 'override');
      assert.equal(proxiedFoo.bigRab(), 'RESOLVED');
    });
  });
});

