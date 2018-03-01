/* global describe, it */
((r) => {
  const Undertaker = r('undertaker');
  const { expect } = r('chai');
  const Coffee = r('../lib/coffee');

  describe('Coffeescript task check for normal init', () => {
    it("Has 'coffee' task", () => {
      const task = (new Undertaker(new Coffee('src'))).task('coffee');
      return expect(task).to.be.ok;
    });
  });
})(require);
