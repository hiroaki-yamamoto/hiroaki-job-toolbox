((require) => {
  module.exports = (
    taskPrefix, packageName, thirdParty, blacklist,
    config, frontendOnly = true, frontendDir = 'frontend'
  ) => {
    const g = require('gulp');
    const karma = require('gulp-karma-runner');

    const helper = require('./helper');

    const thirdPartyBlackLists = helper.thirdPartyBlackLists.concat(blacklist);
    const bl = `!(${thirdPartyBlackLists.join('|')})`;
    const frontend = (frontendOnly) ? '' : `${frontendDir}/`;
    const srcName = thirdParty.concat([
      `${packageName}/${bl}/**/js/${frontend}**/*.js`,
      `${packageName}/${bl}/**/coffee/${frontend}**/*.coffee`,
      `${packageName}/main.coffee`,
      `tests/**/js/${frontend}unit/**/*.js`,
      `tests/**/coffee/${frontend}unit/**/*.coffee`,
    ]);

    g.task(`${taskPrefix}karma.server`, () => g.src(srcName)
      .pipe(helper.handleError())
      .pipe(karma.server(config)));
    g.task(`${taskPrefix}karma.runner`, () => g.src(srcName)
      .pipe(helper.handleError())
      .pipe(karma.runner(config)));
  };
})(require);
