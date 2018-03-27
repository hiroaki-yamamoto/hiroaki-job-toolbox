((req) => {
  const fs = req('fs');
  const path = req('path');
  const LessTasks = req('../').less;
  const rimraf = req('rimraf');
  const g = req('gulp');

  describe('Check css generation from less with default options.', () => {
    const outPath = 'tests/build/test_less/main.css';
    beforeEach((done) => {
      g.registry(new LessTasks('tests/fixtures/test_less/main.less', outPath));
      rimraf(path.dirname(outPath), done);
    });
    afterEach((done) => {
      g.removeAllListeners('error');
      rimraf(path.dirname(outPath), done);
    });

    it('Generates CSS code', (done) => {
      g.on('error', done);
      g.series('less')((err) => {
        if (err) { done(err); return; }
        fs.access(outPath, fs.constants.R_OK, done);
      });
    });
  });
  describe('Check css generation from less with taskPrefixed option.', () => {
    const outPath = 'tests/build/test_less/main_task_prefixed.css';
    beforeEach((done) => {
      g.registry(new LessTasks(
        'tests/fixtures/test_less/main.less', outPath, { taskPrefix: 'test.' }
      ));
      rimraf(path.dirname(outPath), done);
    });
    afterEach((done) => {
      g.removeAllListeners('error');
      rimraf(path.dirname(outPath), done);
    });

    it('Generates CSS code', (done) => {
      g.on('error', done);
      g.series('test.less')((err) => {
        if (err) { done(err); return; }
        fs.access(outPath, fs.constants.R_OK, done);
      });
    });
  });
})(require);
