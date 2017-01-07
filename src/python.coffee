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

  pyvenv = if activateVenv then command.pyvenv else command
  handleResult = (result) ->
    if result.stdout
      console.log result.stdout
    if result.stderr
      console.warn result.stderr
  handleError = (err) ->
    if err instanceof Error
      throw err
    else
      console.error err

  g.task "#{taskPrefix}python.syntax", ->
    pyvenv(
      "flake8 --exclude='#{exclude_patterns.join(",")}' #{package_dest} tests",
      venvPath if activateVenv
    ).then(handleResult).catch(handleError)
  g.task "#{taskPrefix}python.complex", ["#{taskPrefix}python.syntax"], ->
    pyvenv(
      "radon cc -nc -e '#{exclude_patterns.join(' ')}'
        -i '#{exclude_patterns.join(' ')}' #{package_dest} tests",
      venvPath if activateVenv
    ).then(handleResult).catch(handleError)
  g.task "#{taskPrefix}python.mentain", ["#{taskPrefix}python.complex"], ->
    pyvenv(
      "radon mi -nc -e '#{exclude_patterns.join(' ')}'
        -i '#{exclude_patterns.join(' ')}' #{package_dest} tests",
        venvPath if activateVenv
    )
  g.task "#{taskPrefix}python.nosetest", ["#{taskPrefix}python.mentain"], ->
    pyvenv(
      "nosetests #{nosetests_args.join ' '} tests", venvPath if activateVenv
    ).then(handleResult).catch(handleError)
  g.task "#{taskPrefix}python.tox", ["#{taskPrefix}python.mentain"], ->
    pyvenv(
      "tox", venvPath if activateVenv
    ).then(handleResult).catch(handleError)
  g.task "#{taskPrefix}python.tox.only", ->
    command("tox").then(handleResult).catch(handleError)
