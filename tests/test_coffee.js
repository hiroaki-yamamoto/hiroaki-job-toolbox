/* global describe, it, beforeEach, afterEach */
((r) => {
  const gulp = r('gulp');
  const rimraf = r('rimraf');
  const { expect } = r('chai');
  const path = r('path');
  const Coffee = r('../lib/coffee');
  const helper = r('../lib/helper');

  describe('General setting test', () => {
    const outPath = 'tests/build/coffee/assets.js';
    let task;
    beforeEach(() => {
      rimraf.sync(path.dirname(outPath));
      task = new Coffee('tests/fixtures/test_coffee/*.coffee', outPath);
      gulp.registry(task);
      gulp.on('error', (err) => { throw err; });
    });
    afterEach(() => {
      rimraf.sync(outPath);
    });
    it('Check if the option is default setting', () => {
      expect(task.opts).to.eql({
        lintCfg: path.resolve(path.join(__dirname, '../etc/coffeelint.json')),
        isProductionMode: helper.isProduction,
      });
    });
    it('Check code generation', (done) => {
      gulp.series('coffee')((err) => {
        if (err) done(err);
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
      });
    });
  });
})(require);
