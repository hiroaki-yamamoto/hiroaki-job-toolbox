((require) => {
  const RegistryBase = require('./base_registry');

  const helper = require('./helper');

  class Less extends RegistryBase {
    constructor(src, dest, opts) {
      const CleanLESS = require('less-plugin-clean-css');
      super(src, dest, opts, {
        taskPrefix: '',
        plugins: [new CleanLESS({ advanced: true, rebase: true })],
      });
    }

    init(g) {
      const gif = require('gulp-if');
      const autoprefix = require('gulp-autoprefixer');
      const less = require('gulp-less');
      const rename = require('gulp-rename');
      const sourcemaps = require('gulp-sourcemaps');
      g.task(`${this.opts.taskPrefix}less`,
        () => g.src(this.src)
          .pipe(gif(!helper.isProduction, sourcemaps.init()))
          .pipe(less(this.opts))
          .pipe(autoprefix())
          .pipe(rename(`${this.destFileName}`))
          .pipe(gif(!helper.isProduction, sourcemaps.write()))
          .pipe(g.dest(this.dest)));
    }
  }
  module.exports = Less;
})(require);
