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
    const failureOutPath = path.join(outPathBase, 'assets', 'test.js');
    const failureEntry = {};
    before(() => {
      nonPrefixEntry[path.basename(nonPrefixOutPath, '.js')] =
        path.resolve(path.join(__dirname, 'fixtures/test_webpack/ok.es6'));
      failureEntry[path.basename(failureOutPath, '.js')] =
        path.resolve(path.join(__dirname, 'fixtures/test_webpack/fail.es6'));
      g.registry(new Webpack(
        nonPrefixEntry,
        path.resolve(path.join(__dirname, 'build/test_webpack')), {
          webPackConfigToMerge: { mode: 'development' },
        }
      ));
      g.registry(new Webpack(
        failureEntry,
        path.resolve(path.join(__dirname, 'build/test_webpack')), {
          taskPrefix: 'assets.',
          outPath: path.basename(path.dirname(failureOutPath)),
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
    describe('With task prefix and failure expectation', () => {
      it('Should generate an output', (done) => {
        g.on('error', () => done());
        g.series('assets.webpack')((err) => {
          if (!err) done(new Error('Must throw an error'));
        });
      });
    });
  });
})(require);
