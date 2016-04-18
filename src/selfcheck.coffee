# Gulpfile selfcheck task

g = require "gulp"
coffeelint = require "gulp-coffeelint"
eslint = require "gulp-eslint"
notify = require "gulp-notify"
plumber = require "gulp-plumber"

module.exports =
  coffee: (taskPrefix, linterCfg) ->
    g.task "#{taskPrefix}.selfcheck.coffee", ->
      g.src("./gulpfile.coffee").pipe(
        plumber errorHandler: notify.onError '<%= error.message %>'
      ).pipe(
        coffeelint linterCfg
      ).pipe(coffeelint.reporter "coffeelint-stylish").pipe(
        coffeelint.reporter "fail"
      )
  js: (taskPrefix, linterCfg) ->
    g.task "#{taskPreifx}.selfcheck.js", ->
      g.src "./gulpfile.js", ->
        g.src("./gulpfile.coffee").pipe(
          plumber errorHandler: notify.onError '<%= error.message %>'
        ).pipe(
          eslint "configFile": linterCfg
        ).pipe(eslint.format()).pipe(eslint.failAfterError())
