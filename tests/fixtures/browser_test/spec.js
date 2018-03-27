(function() {
  'use strict';
  describe('Adder Test', function () {
    var adder;
    beforeEach(function () {
      adder = new window.Adder();
    });
    it('The result should be 1', function () {
      adder.add(1);
      expect(adder.number()).to.be.equal(1);
    });
  });
  describe('Subtractor Test', function () {
    var sub;
    beforeEach(function () {
      sub = new window.Subtractor();
    });
    it('The result should be 1', function () {
      sub.sub(1);
      expect(sub.number()).to.be.equal(-1);
    });
  });
})();
