((require) => {
  module.exports = (entry, modulePath, outpath = 'static') => {
    const path = require('path');

    const webpack = require('webpack');

    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const Babili = require('babili-webpack-plugin');
    const helper = require('../helper.js');

    return {
      entry,
      output: {
        path: path.resolve(path.join(modulePath, outpath)),
        filename: '[name].js',
      },
      plugins: [
        new webpack.SourceMapDevToolPlugin(),
        new Babili({}, { sourceMap: !helper.helper.isProduction }),
        new ExtractTextPlugin('[name].css'),
      ],
      target: 'web',
      module: require('./rules.js'),
    };
  };
})(require);
