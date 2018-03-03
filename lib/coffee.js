((require) => {
  const path = require('path');
  const gif = require('gulp-if');

  const concat = require('gulp-concat');
  const coffee = require('gulp-coffee');
  const lint = require('gulp-coffeelint');
  const sourcemaps = require('gulp-sourcemaps');
  const uglify = require('gulp-uglify');

  const helper = require('./helper');
  const DefaultRegistry = require('undertaker-registry');

  class CoffeeTask extends DefaultRegistry {
    constructor(src, destPath, opts = {
      lintCfg: path.resolve(path.join(__dirname, '../etc/coffeelint.json')),
    }) {
      super();
      Object.keys(opts).forEach((key) => {
        this[key] = opts[key];
      });
      this.src = src;
      this.destFile = path.basename(destPath);
      this.dest = path.dirname(destPath);
    }
    init(g) {
      g.task('coffee', () => g.src(this.src)
        .pipe(helper.handleError())
        .pipe(lint(this.lintCfg))
        .pipe(lint.reporter('coffeelint-stylish'))
        .pipe(lint.reporter('fail'))
        .pipe(gif(!helper.isProduction, sourcemaps.init()))
        .pipe(coffee())
        .pipe(concat(this.destFile))
        .pipe(uglify({ mangle: true })) // This can be run only production mode.
        .pipe(gif(!helper.isProduction, sourcemaps.write()))
        .pipe(g.dest(this.dest)));
    }
  }
  module.exports = CoffeeTask;
})(require);
