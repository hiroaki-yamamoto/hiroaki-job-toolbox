###
Python testing tasks.
###

g = require "gulp"
command = require "simple-process"

module.exports = (
  taskPrefix, package_dest, venvPath=undefined, activateVenv=true,
  nosetests_args=[], additoinal_exclude_patterns=[]
) ->
  exclude_patterns = [
    ".svn", "CVS", ".bzr", ".hg", ".git",
    "__pycache__", ".tox", ".eggs", "*.egg"
  ].concat(additoinal_exclude_patterns)

  g.task "#{taskPrefix}python.syntax", ->
    command.pyvenv(
      "flake8 --exclude=#{exclude_patterns.join(",")} #{package_dest} tests",
      venvPath, activateVenv
    )
  g.task "#{taskPrefix}python.complex", ["#{taskPrefix}python.syntax"], ->
    command.pyvenv(
      "radon cc -nc -e '#{exclude_patterns.join(' ')}'
        -i '#{exclude_patterns.join(' ')}' #{package_dest} tests",
      venvPath, activateVenv
    )
  g.task "#{taskPrefix}python.mentain", ["#{taskPrefix}python.complex"], ->
    command.pyvenv(
      "radon mi -nc -e '#{exclude_patterns.join(' ')}'
        -i '#{exclude_patterns.join(' ')}' #{package_dest} tests"
      , venvPath, activateVenv
    )
  g.task "#{taskPrefix}python.nosetest", ["#{taskPrefix}python.mentain"], ->
    command.pyvenv(
      "nosetests #{nosetests_args.join ' '} tests",
      venvPath, activateVenv
    )
  g.task "#{taskPrefix}python.tox", ["#{taskPrefix}python.mentain"], ->
    command.pyvenv "tox", venvPath, activateVenv
  g.task "#{taskPrefix}python.tox.only", ->
    command "tox"
