###
Python virtualenv child process spawner.
###

cmd = require "./command"

module.exports = (command) ->
  if command not instanceof Array
    command = [command]
  command.splice 0, 0, ". #{process.env.PYTHON_HOME or ".."}/bin/activate"
  command.push "deactivate"
  cmd command
