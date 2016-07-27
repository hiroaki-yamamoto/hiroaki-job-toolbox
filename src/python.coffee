###
Python testing tasks.
###

g = require "gulp"
virtualenv = require "./virtualenv"
command = require "./command"

module.exports = (
  taskPrefix, package_dest, venvPath=undefined, activateVenv=true,
  nosetests_args=[], additoinal_exclude_patterns=[]
) ->
  exclude_patterns = [
    ".svn", "CVS", ".bzr", ".hg", ".git",
    "__pycache__", ".tox", ".eggs", "*.egg"
  ].concat(additoinal_exclude_patterns)
  radon_ignore_args = (
    "-e #{exclude} -i #{exclude}" for exclude in exclude_patterns
  ).join(" ")

  g.task "#{taskPrefix}python.syntax", ->
    virtualenv(
      "flake8 --exclude=#{exclude_patterns.join("")} #{package_dest} tests",
      venvPath, activateVenv
    )
  g.task "#{taskPrefix}python.complex", ["#{taskPrefix}python.syntax"], ->
    virtualenv(
      "radon cc -nc"
      "#{radon_ignore_args}"
      "#{package_dest} tests", venvPath, activateVenv
    )
  g.task "#{taskPrefix}python.mentain", ["#{taskPrefix}python.complex"], ->
    virtualenv(
      "radon mi -nc"
      "#{radon_ignore_args}"
      "#{package_dest} tests", venvPath, activateVenv
    )
  g.task "#{taskPrefix}python.nosetest", ["#{taskPrefix}python.mentain"], ->
    virtualenv(
      "nosetests #{nosetests_args.join ' '} tests",
      venvPath, activateVenv
    )
  g.task "#{taskPrefix}python.tox", ["#{taskPrefix}python.mentain"], ->
    virtualenv "tox", venvPath, activateVenv
  g.task "#{taskPrefix}python.tox.only", ->
    command "tox"
