###
Python testing tasks.
###

g = require "gulp"
virtualenv = require "./virtualenv"
command = require "./command"

module.exports = (taskPrefix, package_dest, nosetests_args=[]) ->
  g.task "#{taskPrefix}python.syntax", ->
    virtualenv "flake8 #{package_dest} tests"
  g.task "#{taskPrefix}python.complex", ["#{taskPrefix}python.syntax"], ->
    virtualenv "radon cc -nc #{package_dest} tests"
  g.task "#{taskPrefix}python.mentain", ["#{taskPrefix}python.complex"], ->
    virtualenv "radon mi -nc #{package_dest} tests"
  g.task "#{taskPrefix}python.nosetest", ["#{taskPrefix}python.mentain"], ->
    virtualenv "nosetests #{nosetests_args.join ' '} tests"
  g.task "#{taskPrefix}python.tox", ["#{taskPrefix}python.mentain"], ->
    virtualenv "tox"
  g.task "#{taskPrefix}python.tox.only", ->
    command "tox"
