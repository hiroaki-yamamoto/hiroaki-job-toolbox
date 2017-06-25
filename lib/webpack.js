/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
((require) => {
  module.exports = (
    taskPrefix, entry, modulePath, postCssConfigPath, taskdep = [], config
  ) => {
    const g = require('gulp');
    const webpack = require('webpack');
    const q = require('q');
    const helper = require('./helper.js');

    const makeWebpack = () => q.nfcall(
      webpack,
      config || helper.webpackConfig(entry, modulePath, postCssConfigPath)
    ).then((stats) => {
      console.log(stats.toString({ colors: true, chunks: false }));
    }).catch(helper.notifyError);

    g.task(`${taskPrefix}webpack`, taskdep, () => makeWebpack());
  };
})(require);
