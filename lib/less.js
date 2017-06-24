((require) => {
  const g = require('gulp');
  const gif = require('gulp-if');
  const autoprefix = require('gulp-autoprefixer');
  const less = require('gulp-less');
  const rename = require('gulp-rename');
  const sourcemaps = require('gulp-sourcemaps');
  const CleanLESS = require('less-plugin-clean-css');

  const helper = require('./helper');

  module.exports = (
    taskPrefix, pkgname, dest, outFileName = 'assets'
  ) => {
    g.task(`${taskPrefix}less`, () => g.src(`${pkgname}/main.less`)
      .pipe(helper.handleError())
      .pipe(gif(!helper.isProduction, sourcemaps.init()))
      .pipe(less({
        plugins: [new CleanLESS({ advanced: true, rebase: true })],
      }))
      .pipe(autoprefix())
      .pipe(rename(`${outFileName}.css`))
      .pipe(gif(!helper.isProduction, sourcemaps.write()))
      .pipe(g.dest(dest))
    );
  };
})(require);
