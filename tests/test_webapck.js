((req) => {
  const path = req('path');
  const g = req('gulp');
  const rimraf = req('rimraf');
  const { webpack: Webpack } = req('../');

  describe('Webpack test', () => {
    const outPathBase = path.resolve(
      path.join(__dirname, 'build/test_webpack')
    );
    const nonPrefixOutPath = path.join(outPathBase, 'static', 'test.js');
    const nonPrefixEntry = {};
    const prefixOutPath = path.join(outPathBase, 'assets', 'test.js');
    const prefixedEntry = {};
    before(() => {
      nonPrefixEntry[path.basename(nonPrefixOutPath, '.js')] =
        path.resolve(path.join(__dirname, 'fixtures/test_webpack.es6'));
      prefixedEntry[path.basename(prefixOutPath, '.js')] =
        path.resolve(path.join(__dirname, 'fixtures/test_webpack.es6'));
      g.registry(new Webpack(
        nonPrefixEntry,
        path.resolve(path.join(__dirname, 'build/test_webpack')), {
          webPackConfigToMerge: { mode: 'development' },
        }
      ));
      g.registry(new Webpack(
        prefixedEntry,
        path.resolve(path.join(__dirname, 'build/test_webpack')), {
          taskPrefix: 'assets.',
          outPath: path.basename(path.dirname(prefixOutPath)),
          webPackConfigToMerge: { mode: 'development' },
        }
      ));
    });
    beforeEach(done => rimraf(outPathBase, done));
    afterEach((done) => {
      g.removeAllListeners('error');
      rimraf(outPathBase, done);
    });
    describe('Without task prefix', () => {
      it('Should generate an output', (done) => {
        g.on('error', done);
        g.series('webpack')((err) => {
          if (!err) {
            try {
              req('./build/test_webpack/static/test.js');
              done();
            } catch (fsErr) {
              done(fsErr);
            }
          }
        });
      });
    });
  });
})(require);
