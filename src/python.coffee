###
Python testing tasks.
###

g = require "gulp"
command = require "simple-process"

module.exports = (
  taskPrefix, package_dest, venvPath=[], activateVenv=true,
  nosetests_args=[], additoinal_exclude_patterns=[]
) ->
  exclude_patterns = [
    ".svn", "CVS", ".bzr", ".hg", ".git",
    "__pycache__", ".tox", ".eggs", "*.egg"
  ].concat(additoinal_exclude_patterns)

  pyvenv = (cmd) ->
    commandFunc = if activateVenv then command.pyvenv else command
    commandFunc.apply @, [].concat(
      command, if activateVenv then [venvPath, undefined] else [],
      ("stdio": ["inherit", "pipe", "pipe"])
    )

  g.task "#{taskPrefix}python.syntax", ->
    command =
      "flake8 --exclude='#{exclude_patterns.join(",")}' #{package_dest} tests"
    pyvenv command
  g.task "#{taskPrefix}python.complex", ["#{taskPrefix}python.syntax"], ->
    command = "radon cc -nc -e '#{exclude_patterns.join(' ')}'
               -i '#{exclude_patterns.join(' ')}' #{package_dest} tests"
    pyvenv command
  g.task "#{taskPrefix}python.mentain", ["#{taskPrefix}python.complex"], ->
    command = "radon mi -nc -e '#{exclude_patterns.join(' ')}'
               -i '#{exclude_patterns.join(' ')}' #{package_dest} tests"
    pyvenv command
  g.task "#{taskPrefix}python.nosetest", ["#{taskPrefix}python.mentain"], ->
    command = "nosetests #{nosetests_args.join ' '} tests"
    pyvenv command
  g.task "#{taskPrefix}python.tox", ["#{taskPrefix}python.mentain"], ->
    command = "tox"
    pyvenv command
  g.task "#{taskPrefix}python.tox.only", ->
    command "tox", [], ("stdio": ["inherit", "pipe", "pipe"])
