((req) => {
  const path = req('path');
  const { expect } = req('chai');
  const rimraf = req('rimraf');
  const Undertaker = req('undertaker');

  const gulp = req('gulp');

  const JSTask = req('../lib/js');
  const helper = req('../lib/helper');

  describe('JS code concat registry check.', () => {
    const outPath = path.join(__dirname, 'build', 'js', 'assets.js');
    let regist;
    before(() => { gulp.on('error', (err) => { throw err; }); });
    after(() => { gulp.removeAllListeners('error'); });
    beforeEach(() => {
      rimraf.sync(path.dirname(outPath));
      regist = new JSTask('tests/fixtures/test_js/*.js', outPath);
      gulp.registry(regist);
    });
    afterEach(() => { rimraf.sync(path.dirname(outPath)); });
    it('The task registry has the default options',
      () => expect(regist.opts).to.be.eql({
        taskPrefix: '',
        lintCfg: {
          configFile: path.resolve(path.join(__dirname, '../etc/eslint.json')),
        },
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

  describe('Registry initialization with unusual options.', () => {
    let regist;
    let taker;
    beforeEach(() => {
      regist = new JSTask(
        'src', 'dest',
        { taskPrefix: 'prefix.', isProductionMode: true }
      );
      taker = new Undertaker(regist);
    });

    it('The option should be correct.', () => {
      expect(regist.opts).to.be.eql({
        taskPrefix: 'prefix.',
        isProductionMode: true,
        lintCfg: {
          configFile: path.resolve(path.join(__dirname, '../etc/eslint.json')),
        },
      });
    });

    it('The name of task should be prefixed.', () => {
      expect(taker.task('js')).to.be.undefined;
      expect(taker.task('prefix.js')).to.be.ok;
    });
  });
})(require);
