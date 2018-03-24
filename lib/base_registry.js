((require) => {
  const path = require('path');
  const DefaultRegistry = require('undertaker-registry');
  const _ = require('lodash');

  class RegistryBase extends DefaultRegistry {
    constructor(src, destPath, opts, defaultOpts) {
      super();
      this.opts = _.defaults(opts, defaultOpts);
      if (src) { this.src = [].concat(src); }
      if (destPath) {
        this.destFileName = path.basename(destPath);
        this.dest = path.dirname(destPath);
      }
    }
  }

  module.exports = RegistryBase;
})(require);
