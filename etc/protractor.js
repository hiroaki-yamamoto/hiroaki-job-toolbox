(() => {
  exports.config = {
    baseUrl: `http://localhost:${process.env.port || 5000}/`,
    framework: 'mocha',
    mochaOpts: { reporter: 'spec', timeout: 10000 },
  };
})();
