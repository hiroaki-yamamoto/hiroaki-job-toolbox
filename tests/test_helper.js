/* global describe, it */
((require) => {
  const helper = require('../lib/helper.js');
  const { expect } = require('chai');

  describe('Blacklist generation with considering third party.', () => {
    it('Check blacklist pattern', () => {
      const blacklist = ['test', 'hello'];
      expect(helper.generateBlackListPattern(blacklist)).to.equal(
        `!(${blacklist.concat(helper.thirdPartyBlackLists).join('|')})`
      );
    });
  });

  describe('Blacklist generation without considering third party.', () => {
    it('Check blacklist pattern', () => {
      const blacklist = ['test', 'hello'];
      expect(helper.generateBlackListPattern(blacklist, false)).to.equal(
        `!(${blacklist.join('|')})`
      );
    });
  });
})(require);
