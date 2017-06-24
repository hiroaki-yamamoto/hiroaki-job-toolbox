((require) => {
  module.exports = (
    taskPrefix, packageName, dest, blacklist, dependencies = [],
    frontendOnly = true, frontendDir = 'frontend',
    lintCfg = './etc/coffeelint.json',
    outFilename = 'assets', enableBlacklist = true
  ) => {
    const g = require('gulp');
    const gif = require('gulp-if');

    const concat = require('gulp-concat');
    const coffee = require('gulp-coffee');
    const lint = require('gulp-coffeelint');
    const sourcemaps = require('gulp-sourcemaps');
    const uglify = require('gulp-uglify');

    const helper = require('./helper');
    const thirdPartyBlackLists = helper.thirdPartyBlackLists.concat(blacklist);
    const bl = enableBlacklist ? `!(${thirdPartyBlackLists.join('|')})/` : '';
    const frontend = frontendOnly ? '' : `${frontendDir}/`;
    const srcName = [
      `${packageName}/${bl}**/coffee/${frontend}**/*.coffee`,
      `${packageName}/main.coffee`,
    ];
    g.task(`${taskPrefix}coffee`, dependencies, () => g.src(srcName)
      .pipe(helper.handleError())
      .pipe(lint(lintCfg))
      .pipe(lint.reporter('coffeelint-stylish'))
      .pipe(lint.reporter('fail'))
      .pipe(gif(!helper.isProduction, sourcemaps.init()))
      .pipe(coffee())
      .pipe(concat(`${outFilename}.js`))
      .pipe(uglify({ mangle: true })) // This can be run only production mode.
      .pipe(gif(!helper.isProduction, sourcemaps.write()))
      .pipe(g.dest(dest))
    );
  };
})(require);
