'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sourceNodes = undefined;

var _graphqlRequest = require('graphql-request');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gatsbyNodeHelpers = require('gatsby-node-helpers');

var _gatsbyNodeHelpers2 = _interopRequireDefault(_gatsbyNodeHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var sourceNodes = exports.sourceNodes = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref, configOptions) {
    var boundActionCreators = _ref.boundActionCreators,
        reporter = _ref.reporter;

    var createNode, endpoint, queries, _configOptions$typePr, typePrefix, _createNodeHelpers, createNodeFactory, client;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            createNode = boundActionCreators.createNode;
            endpoint = configOptions.endpoint, queries = configOptions.queries, _configOptions$typePr = configOptions.typePrefix, typePrefix = _configOptions$typePr === undefined ? '' : _configOptions$typePr;
            _createNodeHelpers = (0, _gatsbyNodeHelpers2.default)({
              typePrefix: typePrefix
            }), createNodeFactory = _createNodeHelpers.createNodeFactory;

            // Gatsby adds a configOption that's not needed for this plugin, delete it

            delete configOptions.plugins;

            if (endpoint) {
              _context3.next = 6;
              break;
            }

            throw 'No endpoint was passed to plugin';

          case 6:
            client = new _graphqlRequest.GraphQLClient(endpoint, null);
            return _context3.abrupt('return', new Promise(function (resolve, reject) {
              return queries.map(function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(config) {
                  var type, path, extractKey, transform, GQLNode, nodes;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          type = config.type, path = config.path, extractKey = config.extractKey, transform = config.transform;
                          GQLNode = createNodeFactory(type, function (node) {
                            return node;
                          });
                          _context2.next = 4;
                          return _fs2.default.readFileAsync(path).then(function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
                              var result, data;
                              return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                  switch (_context.prev = _context.next) {
                                    case 0:
                                      _context.next = 2;
                                      return client.request(query);

                                    case 2:
                                      result = _context.sent;
                                      data = extractKey ? result[extractKey] : result[type];

                                      transform = transform ? transform : function (data) {
                                        return data;
                                      };
                                      return _context.abrupt('return', data.map(transform).map(GQLNode));

                                    case 6:
                                    case 'end':
                                      return _context.stop();
                                  }
                                }
                              }, _callee, undefined);
                            }));

                            return function (_x4) {
                              return _ref4.apply(this, arguments);
                            };
                          }());

                        case 4:
                          nodes = _context2.sent;

                          nodes.map(function (node) {
                            return createNode(node);
                          });
                          resolve();

                        case 7:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, undefined);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }());
            }));

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function sourceNodes(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

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
