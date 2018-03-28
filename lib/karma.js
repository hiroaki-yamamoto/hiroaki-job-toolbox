((require) => {
  const RegistryBase = require('./base_registry');

  class Karma extends RegistryBase {
    constructor(src, config = require('../etc/karma.conf.js'), opts) {
      super(src, undefined, opts, { taskPrefix: '', watchMode: false });
      this.config = config;
    }
    init(g) {
      const karma = require('gulp-karma-runner');
      const taskFunc = {
        server: karma.server,
        runner: karma.runner,
      };
      Object.entries(taskFunc).forEach((el) => {
        const [taskSuf, func] = el;
        g.task(
          `${this.opts.taskPrefix}karma.${taskSuf}`,
          (done) => {
            let task = g.src(this.src, { read: false })
              .pipe(func(this.config));
            if (taskSuf === 'server' && this.opts.watchMode) {
              task = task.on('karma.server.browsers_ready', () => done());
            } else {
              task = task.on('end', done);
            }
            return task;
          }
        );
      });
    }
  }

  module.exports = Karma;
})(require);
