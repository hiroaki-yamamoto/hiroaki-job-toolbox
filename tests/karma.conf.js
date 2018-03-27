(() => {
  module.exports = {
    basePath: './',
    quiet: false,
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['progress'],
    colors: false,
    logLevel: 'INFO',
    autoWatch: false,
    singleRun: true,
    port: 9876,
    preprocessors: { '**/*.coffee': ['coffee'] },
    coffeePreprocessor: { options: { sourceMap: true } },
    browsers: ['PhantomJS'],
    plugins: [
      'karma-mocha',
      'karma-chai-plugins',
      'karma-chrome-launcher',
      'karma-coffee-preprocessor',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-sinon',
    ],
  };
})();
