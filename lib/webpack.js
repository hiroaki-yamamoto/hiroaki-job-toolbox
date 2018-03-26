/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
((require) => {
  const _ = require('lodash');
  const Base = require('./base_registry');

  class WebPackRegistry extends Base {
    constructor(entry, modulePath, opts) {
      super(
        undefined, undefined, opts,
        {
          taskPrefix: '',
          postCssConfigPath: undefined,
          webPackConfig: undefined,
          webPackConfigToMerge: {},
          outPath: undefined,
        }
      );
      this.entry = entry;
      this.modulePath = modulePath;
    }
    init(g) {
      const helper = require('./helper.js');
      const webpack = require('webpack');
      const webpackConfig = _.merge(
        this.opts.webPackConfig || helper.webpackConfig(
          this.entry, this.modulePath, this.opts.postCssConfigPath,
          this.opts.outPath
        ), this.opts.webPackConfigToMerge
      );
      const makeWebPack = () => (new Promise((res, rej) => {
        webpack(
          webpackConfig,
          (error, stats) => {
            if (error) {
              rej(error);
              return;
            }
            if (stats.hasErrors()) {
              const statsError = new Error(
                `The webpack exited with non-good status.
                 For details, check stats property of this error.`
              );
              statsError.stats = stats;
              rej(statsError);
            }
            res(stats);
          }
        );
      })).then((stats) => {
        console.log(stats.toString({ colors: true, chunks: false }));
      }).catch(err => g.emit('error', err));
      g.task(`${this.opts.taskPrefix}webpack`, makeWebPack);
    }
  }
  module.exports = WebPackRegistry;
})(require);
