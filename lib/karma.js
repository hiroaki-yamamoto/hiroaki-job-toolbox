((require) => {
  const RegistryBase = require('./base_registry');
  const karma = require('gulp-karma-runner');

  class Karma extends RegistryBase {
    constructor(src, config = require('../etc/karma.conf.js'), opts) {
      super(src, undefined, opts, { taskPrefix: '' });
      this.config = config;
    }
    init(g) {
      g.task(
        `${this.opts.taskPrefix}karma.server`,
        () => g.src(this.src, { read: false })
          .pipe(karma.server(this.config))
      );
      g.task(
        `${this.opts.taskPrefix}karma.runner`,
        () => g.src(this.src, { read: false })
          .pipe(karma.runner(this.config))
      );
    }
  }

  module.exports = Karma;
})(require);
