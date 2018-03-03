/* global describe, it, beforeEach, afterEach */
((r) => {
  const gulp = r('gulp');
  const Undertaker = r('undertaker');
  const rimraf = r('rimraf');
  const { expect } = r('chai');
  const path = r('path');
  const Coffee = r('../lib/coffee');

  describe('Coffeescript task check for normal init', () => {
    it('Has "coffee" task', () => {
      const task = (new Undertaker(new Coffee('src', 'dest'))).task('coffee');
      return expect(task).to.be.ok;
    });
  });

  describe('The task should actually work', () => {
    const outPath = 'tests/build/coffee/assets.js';
    beforeEach(() => {
      rimraf.sync(path.dirname(outPath));
      gulp.registry(
        new Coffee('tests/fixtures/test_coffee/*.coffee', outPath)
      );
      gulp.on('error', (err) => { throw err; });
    });
    afterEach(() => {});
    // afterEach(() => {
    //   rimraf.sync(outPath);
    // });
    it('Check code generation', (done) => {
      gulp.series('coffee')((err) => {
        if (err) done(err);
        const assets = r('./build/coffee/assets.js');
        expect(assets.add(1, 2)).to.be.equal(3);
        done();
      });
    });
  });
})(require);
