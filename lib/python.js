((require) => {
  module.exports = (
    taskPrefix, packageDest, venvPath = [], activateVenv = true,
    nosetestsArgs = [], additoinalExcludePatterns = []
  ) => {
    const g = require('gulp');
    const helper = require('./helper.js');
    const command = require('simple-process');

    const excludePatterns = [
      '.svn', 'CVS', '.bzr', '.hg', '.git',
      '__pycache__', '.tox', '.eggs', '*.egg',
    ].concat(additoinalExcludePatterns);

    function pyvenv(cmd) {
      const commandFunc = activateVenv ? command.pyvenv : command;
      commandFunc.apply(this, [].concat(
        cmd, activateVenv ? [venvPath, undefined] : [],
        { stdio: ['inherit', 'inherit', 'pipe'] }
      )).catch((err) => {
        const error =
          (err instanceof Error) ?
            err : new Error(`${err.stderr} (Code: ${err.code})`);
        helper.notifyError(error);
        throw error;
      });
    }

    g.task(`${taskPrefix}python.syntax`, () => pyvenv(
      `flake8 --exclude='${excludePatterns.join(',')}' ${packageDest} tests`
    ));
    g.task(
      `${taskPrefix}python.complex`, [`${taskPrefix}python.syntax`],
      () => pyvenv(
        `radon cc -nc -e '${excludePatterns.join(' ')}' \
        -i '${excludePatterns.join(' ')}' ${packageDest} tests`
      )
    );
    g.task(
      `${taskPrefix}python.mentain`, [`${taskPrefix}python.complex`],
      () => pyvenv(
        `radon mi -nc -e '${excludePatterns.join(' ')}' \
        -i '${excludePatterns.join(' ')}' ${packageDest} tests`
      )
    );
    g.task(
      `${taskPrefix}python.nosetest`, [`${taskPrefix}python.mentain`],
      () => pyvenv(`nosetests ${nosetestsArgs.join(' ')} tests`)
    );
    g.task(
      `${taskPrefix}python.tox`, [`${taskPrefix}python.mentain`],
      () => pyvenv('tox')
    );
    g.task(`${taskPrefix}python.tox.only`, () => command(
      'tox', [], { stdio: ['inherit', 'inherit', 'pipe'] }
    ).catch((err) => {
      const error = (err instanceof Error) ?
        err : new Error(`${err.stderr} (Code: ${err.code})`);
      helper.notifyError(error);
      throw error;
    }));
  };
})(require);
