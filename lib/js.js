((require) => {
  const g = require('gulp');
  const gif = require('gulp-if');

  const concat = require('gulp-concat');
  const linter = require('gulp-eslint');
  const sourcemaps = require('gulp-sourcemaps');
  const uglify = require('gulp-uglify');

  const helper = require('./helper');

  module.exports = (
    taskPrefix, pkgname, dest, blacklist,
    dependencies = [], frontendOnly = true, frontendDir = 'frontend',
    lintCfg = './etc/eslint.json', outFileName = 'assets'
  ) => {
    const thirdPartyBlackLists = helper.thirdPartyBlackLists.concat(blacklist);
    const bl = `!(${thirdPartyBlackLists.join('|')})`;
    const frontend = frontendOnly ? '' : `${frontendDir}/`;
    const srcName = [
      `${pkgname}/${bl}/**/js/${frontend}**/*.js`,
      `${pkgname}/main.js`,
    ];
    g.task(`${taskPrefix}js`, dependencies, () => g.src(srcName)
      .pipe(helper.handleError())
      .pipe(linter({ configFile: lintCfg }))
      .pipe(linter.format())
      .pipe(linter.failAfterError())
      .pipe(gif(!helper.isProduction, sourcemaps.init()))
      .pipe(concat(`${outFileName}.js`))
      .pipe(uglify({ mangle: true }))
      .pipe(gif(!helper.isProduction, sourcemaps.write()))
      .pipe(g.dest(dest))
    );
  };
})(require);
