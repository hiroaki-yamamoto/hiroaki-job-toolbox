((require) => {
  const Base = require('./base_registry.js');
  const helper = require('./helper');

  const gif = require('gulp-if');
  const autoprefix = require('gulp-autoprefixer');
  const cleancss = require('gulp-cleancss');
  const rename = require('gulp-rename');
  // const path = require('path');
  const sass = require('gulp-sass');
  const sourcemaps = require('gulp-sourcemaps');

  class Sass extends Base {
    constructor(src, dest, opts) {
      super(src, dest, opts, { taskPrefix: '' });
      // this.extName = path.extname(this.destFileName);
      // this.destFileName = path.basename(this.destFileName, this.extName);
    }
    init(g) {
      g.task(`${this.opts.taskPrefix}sass`, () => g.src(this.src)
        .pipe(gif(!helper.isProduction, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(cleancss({ advanced: true, rebase: true }))
        .pipe(autoprefix())
        .pipe(rename(this.destFileName))
        .pipe(gif(!helper.isProduction, sourcemaps.write()))
        .pipe(g.dest(this.dest)));
    }
  }
  module.exports = Sass;
})(require);
