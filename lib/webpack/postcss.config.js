((require) => {
  const helper = require('../helper.js');
  module.exports = {
    plugins: [
      require('postcss-clean')({ sourceMap: !helper.isProduction }),
      require('autoprefixer')(),
    ],
  };
})(require);
