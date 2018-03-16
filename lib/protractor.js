((require) => {
  const Base = require('./base_registry.js');
  const { protractor } = require('gulp-protractor');
  class Protractor extends Base {
    constructor(specFilePaths, config, opts) {
      super(specFilePaths, undefined, opts, { taskPrefix: '' });
      this.config = config;
      this.src = [].concat(this.src);
    }
    init(g) {
      g.task(
        `${this.opts.taskPrefix}protractor`,
        () => g.src(this.src).pipe(protractor(this.config))
      );
    }
  }
  module.exports = Protractor;
})(require);
