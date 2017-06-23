((require) => {
  const g = require('gulp');

  const coffee = require('gulp-coffee');
  const lint = require('gulp-coffeelint');

  const helper = require('./helper.js');
  const protractor = require('gulp-protractor').protractor;

  const browserConfig = {
    chrome: ['--capabilities.browserName=chrome', '--directConnect'],
    firefox: ['--capabilities.browserName=firefox', '--directConnect'],
  };

  module.exports = (taskPrefix, frontendOnly, frontendDir = 'frontend') => {
    g.task(`${taskPrefix}frontend.e2e.conf.compile`, () =>
      g.src('./protractor/config.coffee')
        .pipe(helper.handleError())
        .pipe(lint('./coffeelint.json'))
        .pipe(lint.reporter('coffeelint-stylish'))
        .pipe(lint.reporter('failOnWarning'))
        .pipe(coffee())
        .pipe(g.dest('./protractor'))
    );

    const frontend = (frontendOnly) ? '' : `${frontendDir}/`;
    Object.entries(browserConfig).forEach((item) => {
      const [browser, args] = item;
      g.task(`${taskPrefix}frontend.e2e.${browser}`, [
        `${taskPrefix}frontend.e2e.conf.compile`,
      ], () => {
        g.start('server.allocate');
        return g.src(`tests/**/js/${frontend}e2e/**/*.js`)
          .pipe(helper.handleError())
          .pipe(protractor({ args, configFile: './protractor/config.js' }))
          .on('close', () => g.start('server.terminate'));
      });
    });
  };
})(require);
