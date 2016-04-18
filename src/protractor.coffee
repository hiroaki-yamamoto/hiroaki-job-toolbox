###
Protractor gulp
###

g = require "gulp"

plumber = require "gulp-plumber"
notify = require "gulp-notify"
protractor = require("gulp-protractor").protractor
q = require "q"

virtualenv = require "./virtualenv"


browserConfig =
  "chrome": [
    "--capabilities.browserName=chrome"
    "--directConnect"
  ]
  "firefox": [
    "--capabilities.browserName=firefox"
    "--directConnect"
  ]

module.exports = (taskPrefix, frontendOnly, frontendDir="frontend") ->
  g.task "#{taskPrefix}frontend.e2e.conf.compile", ->
    g.src(
      "./protractor/config.coffee"
    ).pipe(
      plumber "errorHandler": notify.onError '<%= error.message %>'
    ).pipe(
      lint("./coffeelint.json")
    ).pipe(
      lint.reporter "coffeelint-stylish"
    ).pipe(
      lint.reporter "failOnWarning"
    ).pipe(
      coffee()
    ).pipe g.dest("./protractor")

  frontend = if frontendOnly then "" else "#{frontendDir}/"
  for browser, args of browserConfig
    do (browser, args) ->
      g.task "#{taskPrefix}frontend.e2e.#{browser}", [
        "#{taskPrefix}frontend.e2e.conf.compile"
      ], ->
        g.start "server.allocate"
        g.src("tests/**/js/#{frontend}e2e/**/*.js").pipe(
          plumber "errorHandler": notify.onError '<%= error.message %>'
        ).pipe(
          protractor("configFile": "./protractor/config.js", "args": args)
        ).on "close", -> g.start "server.terminate"
