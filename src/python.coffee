###
Python testing tasks.
###

g = require "gulp"
virtualenv = require "./virtualenv"

module.exports = (taskPrefix, package_dest, require_syntax=true,
require_complex=true, require_mentain=true) ->
  unit_test_dependencies = []
  if require_syntax
    unit_test_dependencies.push "python.syntax"
  if require_complex
    unit_test_dependencies.push "python.complex"
  if require_mentain
    unit_test_dependencies.push "python.mentain"

  g.task "#{taskPrefix}python.syntax", ->
    virtualenv "flake8 #{package_dest}"
  g.task "#{taskPrefix}python.complex", ->
    virtualenv "radon cc -nc #{package_dest}"
  g.task "#{taskPrefix}python.mentain", ->
    virtualenv "radon mi -nc #{package_dest}"

  g.task "#{taskPrefix}python.nosetest", unit_test_dependencies, ->
    virtualenv(
      "nosetests --with-coverage --cover-erase"
      "--cover-package=#{package_dest} --all tests"
    )
  g.task "#{taskPrefix}python.tox", unit_test_dependencies, ->
    virtualenv "tox"
