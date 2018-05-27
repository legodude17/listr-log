const ll = require('.');

ll.npm = 'Use npm';
ll.git = 'Use git';

ll.start('Make a thing');

setTimeout(() => ll.npm.failure('me'), 100);
setTimeout(() => ll.git.failure('me'), 400);

setTimeout(() => ll.npm.complete('Done with that'), 2000);
setTimeout(() => ll.git.complete('Mooo'), 1000);

setTimeout(() => process.exit(0), 5000);
