((require) => {
  const path = require('path');
  const ExtractTextPlugin = require('extract-text-webpack-plugin');
  const isProd = require('../helper.js').isProduction;
  module.exports = (postCssConfigPath) => {
    const cssLoaders = [
      {
        loader: 'css-loader',
        options: { sourceMap: !isProd, importLoaders: 2 },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path:
              postCssConfigPath ||
              path.resolve(path.join(__dirname, 'postcss.config.js')),
          },
        },
      },
    ];
    return {
      rules: [
        {
          test: /\.es6$/,
          use: [{ loader: 'babel-loader', options: { presets: ['env'] } }],
        }, {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: {
              loader: 'style-loader', options: { sourceMap: !isProd },
            },
            use: cssLoaders.concat(
              { loader: 'sass-loader', options: { sourceMap: !isProd } }
            ),
          }),
        }, {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: {
              loader: 'style-loader', options: { sourceMap: !isProd },
            },
            use: cssLoaders,
          }),
        },
        { test: /\.(?:woff|eot|ttf|svg)/, use: [{ loader: 'url-loader' }] },
      ],
    };
  };
})(require);