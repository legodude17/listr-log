const rx = require('rxjs');
const prettyTime = require('pretty-time');

class Task extends rx.Subject {
  constructor(task) {
    super();

    this.title = task.title;
    this.name = task.name;
    this._subtasks = [];
    this._state = 'PENDING';
    this._enabled = true;
    this.output = '';
    this.startTime = process.hrtime();
  }

  get subtasks() {
    return this._subtasks;
  }

  get state() {
    return this._state;
  }

  setState(state) {
    this._state = state;
    this.next({
      type: 'STATE'
    });
  }

  setOutput(output) {
    this.output = output;
    this.next({
      type: 'DATA'
    });
  }

  hasSubtasks() {
    return this.subtasks.length !== 0;
  }

  isPending() {
    return this._state === 'PENDING';
  }

  isSkipped() {
    return this._state === 'SKIPPED';
  }

  isCompleted() {
    return this._state === 'COMPLETED';
  }

  isEnabled() {
    return this._enabled;
  }

  hasFailed() {
    return this._state === 'FAILED';
  }

  error(err) {
    err = typeof err === 'string' ? err : err.message;
    this.setState('FAILED');
    this.output = err;
  }

  complete(message) {
    this.setState('COMPLETED');
    this.output = `${message} (took ${prettyTime(process.hrtime(this.startTime))})`;
  }

  addTask(task) {
    if (!this[task.name]) this[task.name] = task;

    this._subtasks.push(task);

    this.next({
      type: 'SUBTASKS'
    });
  }
}

module.exports = Task;