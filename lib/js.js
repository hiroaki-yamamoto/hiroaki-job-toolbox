((require) => {
  const path = require('path');
  const _ = require('lodash');
  const DefaultRegistry = require('undertaker-registry');
  const helper = require('./helper');

  const gif = require('gulp-if');

  const concat = require('gulp-concat');
  const linter = require('gulp-eslint');
  const sourcemaps = require('gulp-sourcemaps');
  const uglify = require('gulp-uglify');

  class JavaScriptTask extends DefaultRegistry {
    constructor(src, dest, opts) {
      super();
      this.src = src;
      this.destPath = path.dirname(dest);
      this.destFileName = path.basename(dest);
      this.opts = _.defaults(opts, {
        taskPrefix: '',
        lintCfg: path.resolve(path.join(__dirname, '../etc/eslint.json')),
        isProductionMode: helper.isProduction,
      });
    }
    init(g) {
      g.task(`${this.opts.taskPrefix}js`, () => g.src(this.src)
        .pipe(helper.handleError())
        .pipe(linter({ configFile: this.opts.lintCfg }))
        .pipe(linter.format())
        .pipe(linter.failAfterError())
        .pipe(gif(!this.opts.isProductionMode, sourcemaps.init()))
        .pipe(concat(this.destFileName))
        .pipe(uglify({ mangle: true }))
        .pipe(gif(!this.opts.isProductionMode, sourcemaps.write()))
        .pipe(g.dest(this.destPath)));
    }
  }
  module.exports = JavaScriptTask;
})(require);
