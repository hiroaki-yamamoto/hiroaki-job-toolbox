((req) => {
  const fs = req('fs');
  const path = req('path');
  const SassTask = req('../').sass;
  const rimraf = req('rimraf');
  const g = req('gulp');

  describe('Check css generation from sass with default options.', () => {
    const outPath = 'tests/build/test_sass/main.css';
    beforeEach((done) => {
      g.registry(new SassTask('tests/fixtures/test_sass/main.scss', outPath));
      rimraf(path.dirname(outPath), done);
    });
    afterEach((done) => {
      g.removeAllListeners('error');
      rimraf(path.dirname(outPath), done);
    });

    it('Generates CSS code', (done) => {
      g.on('error', done);
      g.series('sass')((err) => {
        if (err) { done(err); return; }
        fs.access(outPath, fs.constants.R_OK, done);
      });
    });
  });
  describe('Check css generation from sass with taskPrefixed option.', () => {
    const outPath = 'tests/build/test_sass/main_task_prefixed.css';
    beforeEach((done) => {
      g.registry(new SassTask(
        'tests/fixtures/test_sass/main.scss', outPath, { taskPrefix: 'test.' }
      ));
      rimraf(path.dirname(outPath), done);
    });
    afterEach((done) => {
      g.removeAllListeners('error');
      rimraf(path.dirname(outPath), done);
    });

    it('Generates CSS code', (done) => {
      g.on('error', done);
      g.series('test.sass')((err) => {
        if (err) { done(err); return; }
        fs.access(outPath, fs.constants.R_OK, done);
      });
    });
  });
})(require);
