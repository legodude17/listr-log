// Forked from https://github.com/SamVerschueren/listr-update-renderer
const logUpdate = require('log-update');
const chalk = require('chalk');
const figures = require('figures');
const indentString = require('indent-string');
const cliTruncate = require('cli-truncate');
const elegantSpinner = require('elegant-spinner');
const logSymbols = require('log-symbols');

const pointer = chalk.yellow(figures.pointer);
const skipped = chalk.yellow(figures.arrowDown);

const isDefined = x => x != null;

const getSymbol = task => {
  if (!task.spinner) {
    task.spinner = elegantSpinner();
  }

  if (task.isPending()) {
    return task.hasSubtasks() ? pointer : chalk.yellow(task.spinner());
  }

  if (task.isCompleted()) {
    return logSymbols.success;
  }

  if (task.hasFailed()) {
    return task.subtasks.length > 0 ? pointer : logSymbols.error;
  }

  if (task.isSkipped()) {
    return skipped;
  }

  return ' ';
};

const getCompletion = task => ` - ${
  chalk.dim(cliTruncate(
    task.output.split('\n')[0],
    Math.floor(process.stdout.columns / 2)
  ))}`;

const renderHelper = (tasks, options, level) => {
  level = level || 0;

  let output = [];

  for (const task of tasks) {
    if (task.isEnabled()) {
      const skipped = task.isSkipped() ? ` ${chalk.dim('[skipped]')}` : '';

      output.push(indentString(
        ` ${getSymbol(task, options)} ${task.title}${skipped}${task.isPending() ? '' : getCompletion(task)}`,
        level,
        '  '
      ));

      if ((task.isPending() || task.isSkipped()) && isDefined(task.output)) {
        let data = task.output;

        if (typeof data === 'string') {
          data = data.trim().split('\n').filter(Boolean).pop();

          if (data === '') {
            data = undefined;
          }
        }

        if (isDefined(data)) {
          const out = indentString(data, level, '  ');
          output.push(`   ${cliTruncate(out, process.stdout.columns - 3)}`);
        }
      }

      if (
        (task.isPending() || task.hasFailed() || options.collapse === false) &&
        (task.hasFailed() || options.showSubtasks !== false) &&
        task.subtasks.length > 0
      ) {
        output = output.concat(renderHelper(task.subtasks, options, level + 1));
      }
    }
  }

  return output.join('\n');
};

const render = (tasks, options) => {
  logUpdate(renderHelper(tasks, options));
};

class UpdateRenderer {
  constructor(tasks, options) {
    this._tasks = tasks;
    this._options = Object.assign({
      showSubtasks: true,
      collapse: true,
      clearOutput: false
    }, options);
  }

  render() {
    if (this._id) {
      // Do not render if we are already rendering
      return;
    }

    this._id = setInterval(this.renderNow.bind(this), 100);
  }

  end(err) {
    if (this._id) {
      clearInterval(this._id);
      this._id = undefined;
      this.renderNow();
    }


    if (err) {
      logUpdate.clear();
    } else {
      logUpdate.done();
    }
  }

  renderNow() {
    render(this._tasks, this._options);
  }
}

module.exports = UpdateRenderer;
