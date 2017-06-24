((require) => {
  const notify = require('gulp-notify');
  const plumber = require('gulp-plumber');
  module.exports = {
    thirdPartyBlackLists: [
      'third_party', 'thirdParty', 'thirdparty', '3rdparty', '3rd_party',
      '3rdParty', 'external',
    ],
    isProduction: process.env.CI || process.env.node_mode === 'production' ||
                  process.env.NODE_ENV === 'production',
    notifyError: notify.onError('<%= error.message %>'),
    handleError: () => plumber({
      errorHandler: notify.onError('<%= error.message %>'),
    }),
    webpack: require('./webpack.js'),
    webpackConfig: require('./webpack/webpack.conf.js'),
    postcssConfig: require('./webpack/postcss.config.js'),
  };
})(require);
