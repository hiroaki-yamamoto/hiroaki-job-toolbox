/* global browser */
exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'mocha',
  directConnect: true,
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=800,600'],
    },
  },
  onPrepare: () => { browser.resetUrl = 'file://'; },
};
