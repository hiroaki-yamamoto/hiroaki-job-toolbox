# Server tasks


childProcess = require "child_process"
freeport = require "freeport"
g = require "gulp"
q = require "q"

module.exports = (taskPrefix) ->
  server = undefined
  g.task "#{taskPrefix}server.allocate", ->
    q.nfcall(freeport).then (port) ->
      process.env.port = port.toString()
      server = childProcess.spawn(
        "./server", ["testing", "localhost", port.toString()],
        "stdio": "ignore"
      )

  g.task "#{taskPrefix}server.terminate", ->
    server.kill "SIGHUP"
    delete process.env.port
