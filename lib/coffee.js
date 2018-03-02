((require) => {
  const path = require('path');
  const gif = require('gulp-if');

  const concat = require('gulp-concat');
  const coffee = require('gulp-coffee');
  const lint = require('gulp-coffeelint');
  const sourcemaps = require('gulp-sourcemaps');
  const uglify = require('gulp-uglify');

  const helper = require('./helper');
  const DefaultRegistry = require('undertaker-registry');

  class CoffeeTask extends DefaultRegistry {
    constructor(packageName, dest, opts = {
      frontenDir: 'frontend',
      lintCfg: path.resolve(path.join(__dirname, '../etc/coffeelint.json')),
      outFilename: 'assets',
      thirdParty: helper.thirdPartyBlackLists,
      blackListThirdParty: true,
    }) {
      super();
      Object.keys(opts).forEach((key) => {
        this[key] = opts[key];
      });
      this.packageName = packageName;
      this.dest = dest;
    }
    init(g) {
      let blacklist = (this.blackListThirdParty) ?
        this.thirdParty.concat(this.blacklist) :
        this.blacklist;
      blacklist = `!(${blacklist.join('|')})`;

      const srcName = [
        path.join(
          this.packageName, blacklist || '',
          '**', 'coffee', this.frontendDir || '',
          '**', '*.coffee'
        ),
        path.join(this.packageName, 'main.coffee'),
      ];
      g.task('coffee', () => g.src(srcName)
        .pipe(helper.handleError())
        .pipe(lint(this.lintCfg))
        .pipe(lint.reporter('coffeelint-stylish'))
        .pipe(lint.reporter('fail'))
        .pipe(gif(!helper.isProduction, sourcemaps.init()))
        .pipe(coffee())
        .pipe(concat(`${this.outFilename}.js`))
        .pipe(uglify({ mangle: true })) // This can be run only production mode.
        .pipe(gif(!helper.isProduction, sourcemaps.write()))
        .pipe(g.dest(this.dest)));
    }
  }
  module.exports = CoffeeTask;
})(require);
