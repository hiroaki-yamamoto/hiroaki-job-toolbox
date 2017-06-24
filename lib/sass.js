((require) => {
  const helper = require('./helper');
  module.exports = (
    taskPrefix, pkgname, dest, outFileName = 'assets'
  ) => {
    const g = require('gulp');
    const gif = require('gulp-if');
    const autoprefix = require('gulp-autoprefixer');
    const cleancss = require('gulp-cleancss');
    const rename = require('gulp-rename');
    const sass = require('gulp-sass');
    const sourcemaps = require('gulp-sourcemaps');
    g.task(`${taskPrefix}scss`, () => g.src(`${pkgname}/main.scss`)
      .pipe(helper.handleError())
      .pipe(gif(!helper.isProduction, sourcemaps.init()))
      .pipe(sass())
      .pipe(cleancss({ advanced: true, rebase: true }))
      .pipe(autoprefix())
      .pipe(rename({ basename: outFileName }))
      .pipe(gif(!helper.isProduction, sourcemaps.write()))
      .pipe(g.dest(dest)));
  };
})(require);
