((req) => {
  const gulp = req('gulp');
  const ProtractorRegistry = req('../').protractor;

  describe('Protractor test without prefix', () => {
    before(() => {
      gulp.registry(new ProtractorRegistry(
        req.resolve('./fixtures/test_protractor/spec.js'), {
          configFile: req.resolve('./protractor.conf.js'),
        }
      ));
    });
    afterEach(() => gulp.removeAllListeners('error'));
    it('Protractor task should actually work', function (done) {
      this.timeout(10000);
      gulp.on('error', done);
      gulp.series('protractor')((err) => {
        if (!err) done();
      });
    });
  });
  describe('Protractor test with prefix', () => {
    before(() => {
      gulp.registry(new ProtractorRegistry(
        req.resolve('./fixtures/test_protractor/spec.js'), {
          configFile: req.resolve('./protractor.conf.js'),
        }, { taskPrefix: 'test.' }
      ));
    });
    afterEach(() => gulp.removeAllListeners('error'));
    it('Protractor task should actually work', function (done) {
      this.timeout(10000);
      gulp.on('error', done);
      gulp.series('test.protractor')((err) => {
        if (!err) done();
      });
    });
  });
})(require);
