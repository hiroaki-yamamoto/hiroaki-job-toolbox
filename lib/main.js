((require) => {
  module.exports = {
    coffee: require('./coffee.js'),
    js: require('./js.js'),
    karma: require('./karma.js'),
    less: require('./less.js'),
    protractor: require('./protractor.js'),
    python: require('./python.js'),
    sass: require('./sass.js'),
    selfcheck: require('./selfcheck.js'),
    server: require('./server.js'),
    helper: require('./helper.js'),
  };
})(require);