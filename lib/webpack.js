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
      g.task(`${this.opts.taskPrefix}webpack`, (done) => {
        webpack(
          webpackConfig,
          (error, stats) => {
            if (error) {
              g.emit('error', error);
              return;
            }
            if (stats.hasErrors()) {
              const statsError = new Error([
                'The webpack exited with non-good status.',
                'For details, check stats property of this error.',
              ].join(' '));
              statsError.stats = stats;
              g.emit('error', statsError);
              return;
            }
            console.log(stats.toString({ colors: true, chunks: false }));
            done();
          }
        );
      });
    }
  }
  module.exports = WebPackRegistry;
})(require);
