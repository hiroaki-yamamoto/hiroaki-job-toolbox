(() => {
  module.exports = {
    basePath: './',
    quiet: true,
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['progress'],
    colors: false,
    logLevel: 'INFO',
    autoWatch: false,
    singleRun: false,
    port: 9876,
    preprocessors: { '**/*.coffee': ['coffee'] },
    coffeePreprocessor: { options: { sourceMap: true } },
    browsers: ['ChromeHeadless'],
    plugins: [
      'karma-mocha',
      'karma-chai-plugins',
      'karma-chrome-launcher',
      'karma-coffee-preprocessor',
      'karma-sinon',
    ],
  };
})();
