((require) => {
  const RegistryBase = require('./base_registry');

  class Karma extends RegistryBase {
    constructor(src, config = require('../etc/karma.conf.js'), opts) {
      super(src, undefined, opts, { taskPrefix: '' });
      this.config = config;
    }
    init(g) {
      const karma = require('gulp-karma-runner');
      g.task(
        `${this.opts.taskPrefix}karma.server`,
        () => g.src(this.src, { read: false })
          .pipe(karma.server(this.config))
      );
      // This task is used to respond test run request from karma.runner.
      g.task(`${this.opts.taskPrefix}karma.server.watch`, done =>
        g.src(this.src, { read: false })
          .pipe(karma.server(this.config))
          .on('karma.server.browsers_ready', () => done()));
      g.task(
        `${this.opts.taskPrefix}karma.runner`,
        () => g.src(this.src, { read: false })
          .pipe(karma.runner(this.config))
      );
    }
  }

  module.exports = Karma;
})(require);
