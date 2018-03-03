((require) => {
  const notify = require('gulp-notify');
  const plumber = require('gulp-plumber');
  class Helper {
    constructor() {
      this.thirdPartyBlackLists = [
        'third_party', 'thirdParty', 'thirdparty', '3rdparty', '3rd_party',
        '3rdParty', 'external',
      ];
      this.isProduction =
        process.env.CI ||
        process.env.node_mode === 'production' ||
        process.env.NODE_ENV === 'production';
      this.notifyError = notify.onError('<%= error.message %>');
      this.handleError = () => plumber({
        errorHandler: notify.onError('<%= error.message %>'),
      });
      this.webpackConfig = require('./webpack/webpack.conf.js');
      this.postcssConfig = require('./webpack/postcss.config.js');
    }
    generateBlackListPattern(blacklist, considerThirdParty) {
      const internalBlacklist =
        (considerThirdParty) ?
          blacklist.concat(this.thirdPartyBlackLists) :
          blacklist;
      return `!(${internalBlacklist.join('|')})`;
    }
  }
  module.exports = new Helper();
})(require);
