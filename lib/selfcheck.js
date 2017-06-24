((require) => {
  const g = require('gulp');
  const coffeelint = require('gulp-coffeelint');
  const eslint = require('gulp-eslint');
  const helper = require('./helper.js');
  module.exports = {
    coffee: (taskPrefix, linterCfg) => {
      g.task(
        `${taskPrefix}.selfcheck.coffee`,
        () => g.src('./gulpfile.coffee')
          .pipe(helper.handleError())
          .pipe(coffeelint(linterCfg))
          .pipe(coffeelint.reporter('coffeelint-stylish'))
          .pipe(coffeelint.reporter('fail'))
      );
    },
    js: (taskPrefix, linterCfg) => {
      g.task(
        `${taskPrefix}.selfcheck.js`,
        () => g.src('./gulpfile.js')
          .pipe(helper.handleError())
          .pipe(eslint({ configFile: linterCfg }))
          .pipe(eslint.format())
          .pipe(eslint.failAfterError())
      );
    },
  };
})(require);
