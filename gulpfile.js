((require) => {
  const g = require('gulp');
  const lint = require('gulp-eslint');
  const notify = require('gulp-notify');
  const plumber = require('gulp-plumber');
  const istanbul = require('gulp-istanbul');
  const mocha = require('gulp-mocha');

  g.task(
    'coverage.hook', () => g.src('lib/**/*.js')
      .pipe(istanbul())
      .pipe(istanbul.hookRequire())
  );

  g.task(
    'test', () => g.src('tests/**/test_*.js')
      .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
      .pipe(mocha())
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
  );

  g.task('compile', () => g.src('lib/**/*.js')
    .pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
    .pipe(lint())
    .pipe(lint.format())
    .pipe(lint.failAfterError()));

  g.task('default', () => g.watch(['lib/**/*.js', 'tests/**/*.js'], g.series(
    'coverage.hook', 'test', 'compile'
  )));
})(require);
