((require) => {
  const helper = require('./helper.js');
  const Base = require('./base_registry.js');

  class JSSelfCheck extends Base {
    constructor(src = 'gulpfile.js', opts) {
      super(src, undefined, opts, { taskPrefix: '', linterCfg: {} });
    }
    init(g) {
      const eslint = require('gulp-eslint');
      g.task(
        `${this.opts.taskPrefix}.selfcheck.js`,
        () => g.src('./gulpfile.js')
          .pipe(eslint(this.opts.linterCfg))
          .pipe(eslint.format())
          .pipe(eslint.failAfterError())
      );
    }
  }

  class CoffeeSelfCheck extends JSSelfCheck {
    init(g) {
      const coffeelint = require('gulp-coffeelint');
      g.task(
        `${this.opts.taskPrefix}.selfcheck.coffee`,
        () => g.src('./gulpfile.coffee')
          .pipe(helper.handleError())
          .pipe(coffeelint(this.opts.linterCfg))
          .pipe(coffeelint.reporter('coffeelint-stylish'))
          .pipe(coffeelint.reporter('fail'))
      );
    }
  }
  module.exports = {
    js: JSSelfCheck,
    coffee: CoffeeSelfCheck,
  };
})(require);
