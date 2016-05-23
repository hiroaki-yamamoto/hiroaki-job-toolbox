# Child process execution

q = require "q"
childProcess = require "child_process"
notify = require "gulp-notify"

module.exports = (command) ->
  defer= q.defer()
  if command not instanceof Array
    command = [command]
  command = command.join "&&"
  child = childProcess.spawn command, [], (
    "shell": true,
    "stdio": "inherit"
  )
  child.on "error", (error) ->
    notify.onError("<%= error.message %>")(error)
    defer.reject error
  child.on "close", (code, signal) ->
    errStr = "The command failed with "
    if code isnt null and code > 0
      codeErr = new Error errStr + " code: #{code}"
      notify.onError("<%= error.message %>")(codeErr)
      defer.reject codeErr
    if signal isnt null
      signalErr = new Error errStr + " signal: #{signal}"
      notify.onError("<%= error.message %>")(signalErr)
      defer.reject signalErr
    defer.resolve()
  defer.promise
