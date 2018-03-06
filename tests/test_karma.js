((req) => {
  const { expect } = req('chai');
  const Undertaker = req('undertaker');
  const KarmaRegistry = req('../lib/karma.js');
  describe('Karma Registry default configuration and option Test', () => {
    let registry;

    beforeEach(() => { registry = new KarmaRegistry('src'); });
    it('Should have default options.', () => {
      expect(registry.opts).to.be.eql({ taskPrefix: '' });
    });
    it('Should have the default configuration.', () => {
      expect(registry.config).to.be.eql(req('../etc/karma.conf.js'));
    });
  });
  describe('Karma Registry non-default configulation and option test', () => {
    const karmaConfig = req('./karma.conf.js');
    let registry;
    let undertaker;

    beforeEach(() => {
      registry = new KarmaRegistry(
        'src', karmaConfig, { taskPrefix: 'test.' }
      );
      undertaker = new Undertaker(registry);
    });

    it('Should have expected options', () => {
      expect(registry.opts).to.be.eql({ taskPrefix: 'test.' });
    });
    it('Should have expected configuration', () => {
      expect(karmaConfig).not.to.be.deep.eql(req('../etc/karma.conf.js'));
      expect(registry.config).to.be.eql(karmaConfig);
    });
    it('Should have prefixed task', () => {
      expect(undertaker.task('karma.server')).to.be.undefined;
      expect(undertaker.task('karma.runner')).to.be.undefined;
      expect(undertaker.task(
        `${registry.opts.taskPrefix}karma.server`
      )).to.be.ok;
      expect(undertaker.task(
        `${registry.opts.taskPrefix}karma.runner`
      )).to.be.ok;
    });
  });
})(require);
