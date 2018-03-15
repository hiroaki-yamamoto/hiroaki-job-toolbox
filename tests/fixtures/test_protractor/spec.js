((req) => {
  const path = req('path');
  const chai = req('chai');
  chai.use(req('chai-as-promised'));
  const { expect } = chai;
  describe('Protractor Browser Operation Test', () => {
    beforeEach(() => browser.get(
      `file://${path.resolve(__dirname, './index.html')}`
    ));
    it('Type and check the text', () => {
      const txt = 'Test';
      element(by.model('scope.model.text')).sendKeys(txt);
      expect(element(by.css('p#modelValue')).getText())
        .to.be.eventually.equal(txt);
    });
  });
})(require);
