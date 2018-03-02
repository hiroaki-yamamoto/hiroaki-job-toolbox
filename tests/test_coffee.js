/* global describe, it, beforeEach */
((r) => {
  const Undertaker = r('undertaker');
  const { expect } = r('chai');
  const path = r('path');
  const Coffee = r('../lib/coffee');

  describe('Coffeescript task check for normal init', () => {
    it("Has 'coffee' task", () => {
      const task = (new Undertaker(new Coffee('src', 'dest'))).task('coffee');
      return expect(task).to.be.ok;
    });
  });

  describe('The task should actually work', () => {
    const outPath = 'tests/build/coffee';
    let task;
    beforeEach(() => {
      task = new Undertaker(new Coffee('tests/fixtures/coffee', outPath));
    });
    it('Check code generation', (done) => {
      task.series('coffee')(() => {
        const assets = r(path.join(outPath, 'assets.js'));
        expect(assets.add(1, 2)).to.be.equal(3);
        expect(assets.sub(2, 1)).to.be.equal(1);
        done();
      });
    });
  });
})(require);
