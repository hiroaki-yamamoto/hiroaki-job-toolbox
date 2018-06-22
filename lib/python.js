((require) => {
  const Base = require('./base_registry.js');
  const command = require('simple-process');

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
        const error = (err instanceof Error)
          ? err : new Error(`${err.stderr} (Code: ${err.code})`);
        throw error;
      });
    }

    init(g) {
      const excludePatterns = ((this.opts.noVCSExclude) ? [] : this.vcsPatterns)
        .concat(this.opts.additionalExclude);
      const toxArgs = [];
      const radonArgs = {
        complex: 'cc -nc',
        maintain: 'mi -nc',
      };
      const testCmd = {
        nosetest: 'nosetests',
        unittest: 'python -m unittest',
      };
      if (this.opts.toxConfigFile) {
        toxArgs.push(`-c ${this.opts.toxConfigFile}`);
      }
      g.task(`${this.opts.taskPrefix}python.syntax`, () => this.pyvenv(
        `flake8 --exclude='${excludePatterns.join(',')}' \
          ${this.src.join(' ')} ${this.opts.specPath.join(' ')}`
      ));

      Object.entries(radonArgs).forEach((el) => {
        const [taskSuffix, args] = el;
        g.task(
          `${this.opts.taskPrefix}python.${taskSuffix}`,
          () => this.pyvenv(
            `radon ${args} -e '${excludePatterns.join(' ')}' \
            -i '${excludePatterns.join(' ')}' ${this.src.join(' ')} \
            ${this.opts.specPath.join(' ')}`
          )
        );
      });

      Object.entries(testCmd).forEach((el) => {
        const [taskSuffix, cmd] = el;
        g.task(
          `${this.opts.taskPrefix}python.${taskSuffix}`,
          () => this.pyvenv(
            `${cmd} ${this.opts.nosetestsArgs.join(' ')} \
            ${this.opts.specPath.join(' ')}`
          )
        );
      });
      g.task(
        `${this.opts.taskPrefix}python.tox`,
        () => this.pyvenv(`tox ${toxArgs.join(' ')}`)
      );
    }
  }
  module.exports = Python;
})(require);
