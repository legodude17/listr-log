const Task = require('./src/LogTask');
const Renderer = require('./src/Renderer');

const ll = { tasks: [] };

ll.start = function start(name, R) {
  // eslint-disable-next-line import/no-dynamic-require
  if (typeof R === 'string') R = require(R); // eslint-disable-line global-require
  ll.renderer = new (R || Renderer)(ll.tasks);
  ll.renderer.render();
};

ll.addTask = t => {
  const task = new Task(t);
  if (!ll[t.name]) ll[t.name] = task;
  ll.tasks.push(task);
};

module.exports = new Proxy(ll, {
  set(obj, key, val) {
    ll.addTask({ name: key, title: val });
  }
});
