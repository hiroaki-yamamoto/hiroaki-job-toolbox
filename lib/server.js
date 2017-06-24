((require) => {
  const childProcess = require('child_process');
  const freeport = require('freeport');
  const g = require('gulp');
  const q = require('q');
  module.exports = (taskPrefix) => {
    let server;
    g.task(
      `${taskPrefix}server.allocate`, () => q.nfcall(freeport).then(
        (port) => {
          process.env.port = port.toString();
          server = childProcess.spawn(
            './server', ['testing', 'localhost', port.toString()],
            { stdio: 'ignore' }
          );
        }
      )
    );
    g.task(`${taskPrefix}server.terminate`, () => {
      server.kill('SIGHUP');
      delete process.env.port;
    });
  };
})(require);
