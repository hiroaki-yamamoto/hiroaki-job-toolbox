((require) => {
  const helper = require('../lib/helper.js');
  module.exports = {
    basePath: './',
    quiet: true,
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['progress'],
    colors: true,
    logLevel: 'INFO',
    autoWatch: false,
    singleRun: helper.isProduction,
    port: 9876,
    preprocessors: { '**/*.coffee': ['coffee'] },
    coffeePreprocessor: { options: { sourceMap: true } },
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    plugins: [
      'karma-mocha',
      'karma-chai-plugins',
      'karma-chrome-launcher',
      'karma-coffee-preprocessor',
      'karma-firefox-launcher',
      'karma-sinon',
    ],
  };
})(require);
