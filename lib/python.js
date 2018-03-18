((require) => {
  const Base = require('./base_registry.js');
  const command = require('simple-process');
  const helper = require('./helper.js');

  class Python extends Base {
    constructor(src, opts) {
      super(
        src, undefined, opts, {
          taskPrefix: '',
          activateVenv: true,
          noVCSExclude: false,
          envPaths: [],
          additionalExclude: [],
          nosetestsArgs: [],
          unittestArgs: [],
          specPath: 'tests',
        }
      );
      this.vcsPatterns = [
        '.svn', 'CVS', '.bzr', '.hg', '.git',
        '__pycache__', '.tox', '.eggs', '*.egg',
      ];
      this.opts.specPath = [].concat(this.opts.specPath);
    }
    pyvenv(cmd) {
      const commandFunc = this.opts.activateVenv ? command.pyvenv : command;
      return commandFunc.apply(this, [].concat(
        cmd, this.opts.activateVenv ? [this.opts.envPaths, undefined] : [],
        { stdio: ['inherit', 'inherit', 'pipe'] }
      )).catch((err) => {
        const error =
          (err instanceof Error) ?
            err : new Error(`${err.stderr} (Code: ${err.code})`);
        helper.notifyError(error);
        throw error;
      });
    }
    init(g) {
      const excludePatterns =
        ((this.opts.noVCSExclude) ? [] : this.vcsPatterns).concat(
          this.opts.additionalExclude
        );
      const toxArgs = [];
      if (this.opts.toxConfigFile) {
        toxArgs.push(`-c ${this.opts.toxConfigFile}`);
      }
      g.task(`${this.opts.taskPrefix}python.syntax`, () => this.pyvenv(
        `flake8 --exclude='${excludePatterns.join(',')}' \
          ${this.src.join(' ')} ${this.opts.specPath.join(' ')}`
      ));
      g.task(
        `${this.opts.taskPrefix}python.complex`,
        () => this.pyvenv(
          `radon cc -nc -e '${excludePatterns.join(' ')}' \
          -i '${excludePatterns.join(' ')}' ${this.src.join(' ')} \
          ${this.opts.specPath.join(' ')}`
        )
      );
      g.task(
        `${this.opts.taskPrefix}python.maintain`,
        () => this.pyvenv(
          `radon mi -nc -e '${excludePatterns.join(' ')}' \
          -i '${excludePatterns.join(' ')}' ${this.src.join(' ')} \
          ${this.opts.specPath.join(' ')}`
        )
      );
      g.task(
        `${this.opts.taskPrefix}python.nosetest`,
        () => this.pyvenv(
          `nosetests ${this.opts.nosetestsArgs.join(' ')} \
          ${this.opts.specPath.join(' ')}`
        )
      );
      g.task(
        `${this.opts.taskPrefix}python.unittest`,
        () => this.pyvenv(
          `python -m unittest ${this.opts.unittestArgs.join(' ')} \
          ${this.opts.specPath.join(' ')}`
        )
      );
      g.task(
        `${this.opts.taskPrefix}python.tox`,
        () => this.pyvenv(`tox ${toxArgs.join(' ')}`)
      );
    }
  }
  module.exports = Python;
})(require);
