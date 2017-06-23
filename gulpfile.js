((require) => {
  const g = require('gulp');
  const lint = require('gulp-eslint');
  const notify = require('gulp-notify');
  const plumber = require('gulp-plumber');

  g.task('compile', () => {
    g.src('lib/**/*.js').pipe(
      plumber({ errorHandler: notify.onError('<%= error.message %>') })
    ).pipe(lint());
  });
  g.task('default', () => g.watch('./src/**/*.coffee', ['compile']));
})(require);
