((r) => {
  const path = r('path');
  const rimraf = r('rimraf');
  const { expect } = r('chai');
  const Undertaker = r('undertaker');
  const Coffee = r('../lib/coffee');
  const helper = r('../lib/helper');
  const gulp = r('gulp');

  describe('General setting test', () => {
    const outPath = path.join(__dirname, 'build', 'coffee', 'assets.js');
    let task;
    before(() => {
      gulp.on('error', (err) => { throw err; });
      task = new Coffee('tests/fixtures/test_coffee/*.coffee', outPath);
      gulp.registry(task);
    });
    after(() => gulp.removeAllListeners('error'));
    beforeEach(done => rimraf(path.dirname(outPath), done));
    afterEach((done) => { rimraf(path.dirname(outPath), done); });
    it('Check if the option is default setting', () => {
      expect(task.opts).to.eql({
        lintCfg: path.resolve(path.join(__dirname, '../etc/coffeelint.json')),
        isProductionMode: helper.isProduction,
        taskPrefix: '',
      });
    });
    it('Check code generation', (done) => {
      gulp.series('coffee')((err) => {
        expect(err).to.be.undefined;
        const assets = r('./build/coffee/assets.js');
        expect(assets.add(1, 2)).to.be.equal(3);
        done();
      });
    });
  });

  describe('Setting with un-default.', () => {
    let task;
    beforeEach(() => {
      task = new Coffee('src', 'dest', { isProductionMode: true });
    });
    it('Check if the option is correct', () => {
      expect(task.opts).to.eql({
        lintCfg: path.resolve(path.join(__dirname, '../etc/coffeelint.json')),
        isProductionMode: true,
        taskPrefix: '',
      });
    });
  });

  describe('TaskPrefix check', () => {
    let undertaker;
    beforeEach(() => {
      undertaker = new Undertaker(
        new Coffee('src', 'dest', { taskPrefix: 'module.' })
      );
    });
    it('Check if the task name is the expected name.', () => {
      expect(undertaker.task('coffee')).to.be.undefined;
      expect(undertaker.task('module.coffee')).to.be.ok;
    });
  });
})(require);
