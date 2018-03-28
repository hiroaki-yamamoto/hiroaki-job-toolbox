((require) => {
  const path = require('path');
  const RegistryBase = require('./base_registry');
  const helper = require('./helper');

  class JavaScriptTask extends RegistryBase {
    constructor(src, dest, opts) {
      super(src, dest, opts, {
        taskPrefix: '',
        lintCfg: {
          configFile: path.resolve(path.join(__dirname, '../etc/eslint.json')),
        },
        isProductionMode: helper.isProduction,
      });
    }
    init(g) {
      const gif = require('gulp-if');
      const concat = require('gulp-concat');
      const linter = require('gulp-eslint');
      const sourcemaps = require('gulp-sourcemaps');
      const uglify = require('gulp-uglify');
      g.task(
        `${this.opts.taskPrefix}js.lint`,
        () => g.src(this.src)
          .pipe(linter(this.opts.lintCfg))
          .pipe(linter.format())
          .pipe(linter.failAfterError())
      );
      g.task(`${this.opts.taskPrefix}js.compile`, () => g.src(this.src)
        .pipe(gif(!this.opts.isProductionMode, sourcemaps.init()))
        .pipe(concat(this.destFileName))
        .pipe(uglify({ mangle: true }))
        .pipe(gif(!this.opts.isProductionMode, sourcemaps.write()))
        .pipe(g.dest(this.dest)));
      g.task(`${this.opts.taskPrefix}js`, g.series(
        `${this.opts.taskPrefix}js.lint`,
        `${this.opts.taskPrefix}js.compile`
      ));
    }
  }
  module.exports = JavaScriptTask;
})(require);
