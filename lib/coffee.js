((require) => {
  const path = require('path');
  const _ = require('lodash');
  const gif = require('gulp-if');

  const concat = require('gulp-concat');
  const coffee = require('gulp-coffee');
  const lint = require('gulp-coffeelint');
  const sourcemaps = require('gulp-sourcemaps');
  const uglify = require('gulp-uglify');

  const helper = require('./helper');
  const DefaultRegistry = require('undertaker-registry');

  class CoffeeTask extends DefaultRegistry {
    constructor(src, destPath, opts) {
      super();
      this.opts = _.defaults(opts, {
        lintCfg: path.resolve(path.join(__dirname, '../etc/coffeelint.json')),
        isProductionMode: helper.isProduction,
      });
      this.src = src;
      this.destFile = path.basename(destPath);
      this.dest = path.dirname(destPath);
    }
    init(g) {
      g.task('coffee', () => g.src(this.src)
        .pipe(helper.handleError())
        .pipe(lint(this.opts.lintCfg))
        .pipe(lint.reporter('coffeelint-stylish'))
        .pipe(lint.reporter('fail'))
        .pipe(gif(!this.opts.isProductionMode, sourcemaps.init()))
        .pipe(coffee())
        .pipe(concat(this.destFile))
        .pipe(uglify({ mangle: true })) // This can be run only production mode.
        .pipe(gif(!this.opts.isProductionMode, sourcemaps.write()))
        .pipe(g.dest(this.dest)));
    }
  }
  module.exports = CoffeeTask;
})(require);
