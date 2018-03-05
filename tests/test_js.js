((req) => {
  const path = req('path');
  const { expect } = req('chai');
  const rimraf = req('rimraf');

  const gulp = req('gulp');

  const JSTask = req('../lib/js');
  const helper = req('../lib/helper');

  describe('JS code concat registry check.', () => {
    const outPath = path.join(__dirname, 'build', 'js', 'assets.js');
    let regist;
    beforeEach(() => {
      rimraf.sync(path.dirname(outPath));
      regist = new JSTask('tests/fixtures/test_js/*.js', outPath);
      gulp.registry(regist);
      gulp.on('error', (err) => { throw err; });
    });
    afterEach(() => { rimraf.sync(path.dirname(outPath)); });
    it('The task registry has the default options',
      () => expect(regist.opts).to.be.eql({
        taskPrefix: '',
        lintCfg: path.resolve(path.join(__dirname, '../etc/eslint.json')),
        isProductionMode: helper.isProduction,
      }));
    it('The file should be actually generated.', (done) => {
      gulp.series('js')((err) => {
        if (err) done(err);
        const assets = req(path.resolve(outPath));
        const adder = new assets.Adder();
        const sub = new assets.Subtractor();
        adder.add(1);
        sub.sub(1);
        expect(adder.number()).to.be.equal(1);
        expect(sub.number()).to.be.equal(-1);
        done();
      });
    });
  });
})(require);
