# Server tasks


childProcess = require "child_process"
g = require "gulp"
q = require "q"

server = undefined

g.task "server.allocate", ->
  q.nfcall(freeport).then (port) ->
    process.env.port = port.toString()
    server = childProcess.spawn(
      "./server", ["testing", "localhost", port.toString()],
      "stdio": "ignore"
    )

g.task "server.terminate", ->
  server.kill "SIGHUP"
  delete process.env.port
