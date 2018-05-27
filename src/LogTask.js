const Task = require('./Task');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const figures = require('figures');
const { format } = require('util');

const logLevels = {
  success: `${logSymbols.success} `,
  failure: `${logSymbols.error} `,
  warning: `${logSymbols.warn} `,
  info: `${logSymbols.info} `,
  started: `${chalk.blue(figures.circle)} `,
  completed: `${chalk.blue(figures.circleFilled)} `,
  continued: `${chalk.yellow(figures.ellipsis)} `,
  debug: {
    prefix: `${chalk.dim(figures.line)} `,
    color: 'dim'
  }
};

class LogTask extends Task {
  constructor(task) {
    super(task);
    this._history = [];
    this._generateLoggers();
  }

  _output(str) {
    this.output = str;
    this._history.push(str);
  }

  log(...args) {
    this._log('', args, '');
  }

  _log(prefix, args, suffix, color) {
    const str = this._format(args);
    this._output(`${prefix}${color ? chalk[color](str) : str}${suffix}`);
  }

  _generateLoggers() {
    Object.keys(logLevels).forEach(key => {
      const logLevel = typeof logLevels[key] === 'string' ? { prefix: logLevels[key] } : logLevels[key];
      this[key] = (...args) => this._log(logLevel.prefix || '', args, logLevel.suffix || '', logLevel.color);
    });
  }

  /* eslint-disable */
  _format(args) {
    // TODO: Do better formatting
    return format(...args);
  }
  /* eslint-enable */
}

module.exports = LogTask;
