((require) => {
  module.exports = (
    entry, modulePath, postCssConfigPath, outpath = 'static'
  ) => {
    const path = require('path');

    const webpack = require('webpack');

    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const Babili = require('babili-webpack-plugin');
    const helper = require('../helper.js');

    const plugins = [
      new webpack.SourceMapDevToolPlugin(),
      new ExtractTextPlugin('[name].css'),
    ];

    if (
      helper.isProduction ||
      (process.env.WEBPACK_UGLIFY || 'true').toLowerCase() === 'true'
    ) {
      plugins.splice(
        1, 0, new Babili({}, { sourceMap: !helper.isProduction })
      );
    }

    return {
      entry,
      plugins,
      output: {
        path: path.resolve(path.join(modulePath, outpath)),
        filename: '[name].js',
      },
      target: 'web',
      module: require('./rules.js')(postCssConfigPath),
    };
  };
})(require);
