'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

// Need to explicitly enable colors, probably for the same reason as:
// https://github.com/bcaudan/jasmine-spec-reporter/issues/36
var chalk = new _chalk2['default'].constructor({
  enabled: true
});

var LEVELS = {
  debug: {
    name: 'debug',
    color: 'cyan'
  },
  info: {
    name: 'info',
    color: 'magenta'
  },
  warning: {
    name: 'warning',
    color: 'yellow'
  },
  severe: {
    name: 'severe',
    color: 'red'
  }
};

var DEFAULT_LOG_LEVELS = [LEVELS.warning.name, LEVELS.severe.name];

// http://stackoverflow.com/questions/1879860/most-reliable-split-character
var SPLIT_CHAR = '\u0007';

exports['default'] = {
  postTest: function postTest(testPassed) {
    var config = this.config;
    if (this.config.onlyFailingTests === true && testPassed === true) {
      return true;
    }

    return browser.manage().logs().get('browser').then(function (result) {
      result = result.filter(byLogLevel, config);

      if (result.length === 0) {
        return false;
      }

      printHeader.call(config);

      (0, _lodash2['default'])(result).chain().reduce(group, {}).forEach(printLog, config).value();
    });
  }
};

function getLogLevels() {
  return this.logLevels || DEFAULT_LOG_LEVELS;
}

function byLogLevel(log) {
  return getLogLevels.call(this).map(function (name) {
    return name.toLowerCase();
  }).indexOf(log.level.name.toLowerCase()) !== -1;
}

function group(result, log) {
  var message = log.message;
  var id = [message, log.level.name].join(SPLIT_CHAR);
  result[id] = result[id] ? ++result[id] : 1;
  return result;
}

function printHeader() {
  (this.headerPrinter || headerPrinter).call(this);
}

function headerPrinter() {
  var header = 'Test console output (log levels: ' + getLogLevels.call(this).join(', ') + ')';
  console.log(chalk.underline(header));
}

function printLog(count, log) {
  var split = log.split(SPLIT_CHAR);
  var options = {
    message: split[0],
    level: split[1],
    count: count
  };
  var printer = this.logPrinter || logPrinter;
  printer.call(printer, options);
}

function logPrinter(_ref) {
  var message = _ref.message;
  var level = _ref.level;
  var count = _ref.count;

  var color = chalk[LEVELS[level.toLowerCase()].color];
  var args = [color(message)];

  if (count > 1) {
    args.push('(' + count + ')');
  }

  console.log.apply(console, args);
}
module.exports = exports['default'];
