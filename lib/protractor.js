((require) => {
  const Base = require('./base_registry.js');
  const { protractor } = require('gulp-protractor');
  class Protractor extends Base {
    constructor(specFilePaths, config, opts) {
      super(specFilePaths, undefined, opts, { taskPrefix: '', taskSuffix: '' });
      this.confg = config;
      this.src = [].concat(this.src, specFilePaths);
    }
    init(g) {
      g.task(
        `${this.taskPrefix}.protractor${this.taskSuffix}`,
        () => g.src(this.src).pipe(protractor(this.config))
      );
    }
  }
  module.exports = Protractor;
})(require);
