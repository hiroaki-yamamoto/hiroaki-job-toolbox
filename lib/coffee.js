((require) => {
  const path = require('path');
  const gif = require('gulp-if');

  const concat = require('gulp-concat');
  const coffee = require('gulp-coffee');
  const lint = require('gulp-coffeelint');
  const sourcemaps = require('gulp-sourcemaps');
  const uglify = require('gulp-uglify');

  const helper = require('./helper');
  const RegistryBase = require('./base_registry');

  class CoffeeTask extends RegistryBase {
    constructor(src, destPath, opts) {
      super(src, destPath, opts, {
        lintCfg: path.resolve(path.join(__dirname, '../etc/coffeelint.json')),
        isProductionMode: helper.isProduction,
        taskPrefix: '',
      });
    }
    init(g) {
      g.task(`${this.opts.taskPrefix}coffee`, () => g.src(this.src)
        .pipe(lint(this.opts.lintCfg))
        .pipe(lint.reporter('coffeelint-stylish'))
        .pipe(lint.reporter('fail'))
        .pipe(gif(!this.opts.isProductionMode, sourcemaps.init()))
        .pipe(coffee())
        .pipe(concat(this.destFileName))
        .pipe(uglify({ mangle: true })) // This can be run only production mode.
        .pipe(gif(!this.opts.isProductionMode, sourcemaps.write()))
        .pipe(g.dest(this.dest)));
    }
  }
  module.exports = CoffeeTask;
})(require);
