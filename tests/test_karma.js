((req) => {
  const { expect } = req('chai');
  const Undertaker = req('undertaker');
  const gulp = req('gulp');
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

  describe('Karma actual working test', () => {
    beforeEach(() => {
      gulp.registry(new KarmaRegistry([
        'tests/fixtures/test_js/*.js',
        'tests/fixtures/browser_test/*.js',
      ], req('./karma.conf.js')));
    });
    afterEach(() => { gulp.removeAllListeners('error'); });
    describe('For server', () => {
      before(() => { gulp.on('error', (err) => { throw err; }); });
      it('Should run properly', (done) => {
        gulp.series('karma.server')(done);
      });
    });
  });
  describe('For runner', () => {
    it('Should instruct server to run the test', (done) => {
      const handleError = (err) => {
        expect(err.error.message).to.be.equal('Failed Unit Tests!');
        expect(err.error.plugin).to.be.equal('gulp-karma-runner.runner');
        done();
      };
      gulp.on('error', handleError);
      gulp.series('karma.runner')((err) => {
        if (!err) {
          done(new Error('Should raise an error.'));
        }
      });
    });
  });
})(require);
