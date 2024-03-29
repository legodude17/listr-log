const Task = require('./src/LogTask');
const Renderer = require('./src/Renderer');

const ll = { tasks: [] };

ll.start = function start(R) {
  // eslint-disable-next-line import/no-dynamic-require
  if (typeof R === 'string') R = require(R); // eslint-disable-line global-require
  ll.renderer = new (R || Renderer)(ll.tasks);
  ll.renderer.render();
};

ll.pause = function pause() {
  ll.renderer.end();
};

ll.play = function play() {
  ll.renderer.render();
};

ll.end = function end(err) {
  ll.renderer.end(err);
};

ll.addTask = t => {
  const task = new Task(t);
  if (!ll[t.name]) ll[t.name] = task;
  ll.tasks.push(task);
};

module.exports = new Proxy(ll, {
  get(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
    ll.addTask({ name: key, title: key });
    return obj[key];
  },
  set(obj, key, val) {
    ll.addTask({ name: key, title: val });
    return true;
  }
});
