'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceNodes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _graphqlRequest = require('graphql-request');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _crypto = require('crypto');

var crypto = _interopRequireWildcard(_crypto);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var sourceNodes = exports.sourceNodes = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref, configOptions) {
    var boundActionCreators = _ref.boundActionCreators,
        reporter = _ref.reporter;
    var createNode, endpoint, queries, configs;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            createNode = boundActionCreators.createNode;
            endpoint = configOptions.endpoint, queries = configOptions.queries;
            configs = [];

            if (endpoint) {
              _context2.next = 5;
              break;
            }

            throw 'No endpoint was passed to plugin';

          case 5:

            if (Array.isArray(queries)) {
              configs = queries;
            } else {
              configs = [queries];
            }

            // Gatsby adds a configOption that's not needed for this plugin, delete it
            delete configOptions.plugins;

            return _context2.abrupt('return', new Promise(function (resolve, reject) {
              configs.map(function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref3) {
                  var type = _ref3.type,
                      path = _ref3.path,
                      recursive = _ref3.recursive;
                  var data, files;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          data = {};
                          _context.next = 3;
                          return getAllFiles(path, recursive);

                        case 3:
                          files = _context.sent;


                          if (files) {
                            Promise.all(files.map(function (file) {
                              return _fs2.default.readFileAsync(file).then(function (query) {
                                return (0, _graphqlRequest.request)(endpoint, query).then(function (result) {
                                  data = _extends({}, data, result);
                                }).catch(function (err) {
                                  return reject(err);
                                });
                              }).catch(function (err) {
                                return reject(file + ' does not exist');
                              });
                            })).then(function () {
                              var content = JSON.stringify(data);
                              var contentDigest = createContentDigest(content);
                              var child = _extends({}, data, {
                                id: '__graphql__' + contentDigest,
                                parent: null,
                                children: [],
                                internal: {
                                  type: type,
                                  content: content,
                                  contentDigest: contentDigest
                                }
                              });
                              resolve(createNode(child));
                            });
                          }

                        case 5:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, undefined);
                }));

                return function (_x3) {
                  return _ref4.apply(this, arguments);
                };
              }());
            }));

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function sourceNodes(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

var getAllFiles = function getAllFiles(dir) {
  var recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return new Promise(function (resolve, reject) {
    var files = [];
    if (recursive) {
      files = _fs2.default.readdirSync(dir).reduce(function (files, file) {
        var name = _path2.default.join(dir, file);
        var isDirectory = _fs2.default.statSync(name).isDirectory();
        return isDirectory ? [].concat(_toConsumableArray(files), _toConsumableArray(getAllFiles(name))) : [].concat(_toConsumableArray(files), [name]);
      }, []);
    } else {
      files = _fs2.default.readdirSync(dir).map(function (file) {
        return _path2.default.join(dir, file);
      }).filter(function (name) {
        return _fs2.default.statSync(name).isFile();
      });
    }
    resolve(files);
  });
};

_fs2.default.readFileAsync = function (filename) {
  return new Promise(function (resolve, reject) {
    try {
      _fs2.default.readFile(filename, 'utf8', function (err, buffer) {
        if (err) {
          reject(err);
        } else {
          resolve(buffer);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

var createContentDigest = function createContentDigest(content) {
  return crypto.createHash('md5').update(content).digest('hex');
};
