((req) => {
  const g = req('gulp');
  const Python = req('../').python;
  describe('Python Task Registry test', () => {
    before(() => {
      g.registry(new Python(
        req.resolve('./fixtures/test_python/add.py'),
        {
          specPath: 'tests.fixtures.test_python.spec',
        }
      ));
      g.registry(new Python(
        [
          req.resolve('./fixtures/test_python/add.py'),
          req.resolve('./fixtures/test_python/fail_spec.py'),
        ],
        {
          specPath: 'tests.fixtures.test_python.fail_spec',
          taskPrefix: 'failure.',
          toxConfigFile: req.resolve('../fail.tox.ini'),
        }
      ));
    });
    afterEach(() => g.removeAllListeners('error'));

    describe('without Task Prefix', () => {
      Object.entries({
        Flake8: 'python.syntax',
        Complex: 'python.complex',
        Maintainability: 'python.maintain',
        Nosetest: 'python.nosetest',
        Unittest: 'python.unittest',
        Tox: 'python.tox',
      }).forEach((el) => {
        const [name, task] = el;
        it(name, function (done) {
          this.timeout(10000);
          g.on('error', done);
          g.series(task)((err) => { if (!err) done(); });
        });
      });
    });
    describe('with Task Prefix', () => {
      Object.entries({
        Complex: 'failure.python.complex',
        Maintainability: 'failure.python.maintain',
      }).forEach((el) => {
        const [name, task] = el;
        it(name, function (done) {
          this.timeout(10000);
          g.on('error', done);
          g.series(task)((err) => { if (!err) done(); });
        });
      });
      Object.entries({
        Flake8: 'failure.python.syntax',
        Nosetest: 'failure.python.nosetest',
        Unittest: 'failure.python.unittest',
        Tox: 'failure.python.tox',
      }).forEach((el) => {
        const [name, task] = el;
        it(name, function (done) {
          this.timeout(10000);
          g.on('error', () => done());
          g.series(task)((err) => {
            if (!err) done(new Error('Should throw an error.'));
          });
        });
      });
    });
  });
})(require);
