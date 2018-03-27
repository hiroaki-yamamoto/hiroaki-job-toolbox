((require) => {
  module.exports = (
    entry, modulePath, postCssConfigPath, outpath = 'static'
  ) => {
    const path = require('path');

    const webpack = require('webpack');

    const ExtractTextPlugin = require('extract-text-webpack-plugin');

    const plugins = [
      new webpack.SourceMapDevToolPlugin(),
      new ExtractTextPlugin('[name].css'),
    ];

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
