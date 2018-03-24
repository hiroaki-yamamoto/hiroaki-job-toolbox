/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */
((require) => {
  const Base = require('./base_registry');

  class WebPackRegistry extends Base {
    constructor(entry, modulePath, opts) {
      super(
        undefined, undefined, opts,
        {
          taskPrefix: '',
          postCssConfigPath: '',
          webPackConfig: '',
        }
      );
      this.entry = entry;
      this.modulePath = modulePath;
    }
    init(g) {
      const webpack = require('webpack');
      const helper = require('./helper.js');
      const makeWebPack = () => (new Promise((res, rej) => {
        webpack(
          this.opts.webPackConfig || helper.webpackConfig(
            this.entry, this.modulePath, this.opts.postCssConfigPath
          ),
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
  // module.exports = (
  //   taskPrefix, entry, modulePath, postCssConfigPath, taskdep = [], config
  // ) => {
  //   const g = require('gulp');
  //   const webpack = require('webpack');
  //   const q = {};
  //   const helper = require('./helper.js');
  //
  //   const makeWebpack = () => q.nfcall(
  //     webpack,
  //     config || helper.webpackConfig(entry, modulePath, postCssConfigPath)
  //   ).then((stats) => {
  //     console.log(stats.toString({ colors: true, chunks: false }));
  //   }).catch(helper.notifyError);
  //
  //   g.task(`${taskPrefix}webpack`, taskdep, () => makeWebpack());
  // };
})(require);
