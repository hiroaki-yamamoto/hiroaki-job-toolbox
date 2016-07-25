###
Python virtualenv child process spawner.
###

cmd = require "./command"
helper = require "./helper"

module.exports = (
  command, venvPath="#{process.env.VIRTUAL_ENV or ".."}/bin/activate"
) ->
  if command not instanceof Array
    command = [command]
  if venvPath and helper.isProduction
    command.splice 0, 0, ". #{venvPath}"
    command.push "deactivate"
  cmd command
