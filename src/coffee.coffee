# Coffeescript compiler for frontend.
# Backend? just run as-it-is!

g = require "gulp"

concat = require "gulp-concat"
coffee = require "gulp-coffee"
lint = require "gulp-coffeelint"
notify = require "gulp-notify"
plumber = require "gulp-plumber"
sourcemaps = require "gulp-sourcemaps"
uglify = require "gulp-uglify"

helper = require "./helper"

module.exports = (taskPrefix, packageName, dest, blacklist, dependencies=[],
frontendOnly=true, frontendDir="frontend", lintCfg="./etc/coffeelint.json",
out_filename="assets", enableBlacklist=true) ->
  thirdPartyBlackLists = helper.thirdPartyBlackLists.concat blacklist
  blacklist = if enableBlacklist
    "!(#{thirdPartyBlackLists.join '|'})/"
  else ""
  frontend = if frontendOnly then "" else "#{frontendDir}/"
  srcName = [
    "#{packageName}/#{blackist}**/coffee/#{frontend}**/*.coffee"
    "#{packageName}/main.coffee"
  ]

  g.task "#{taskPrefix}coffee", dependencies, ->
    pipe = g.src(srcName).pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    ).pipe(lint(lintCfg)).pipe(
      lint.reporter 'coffeelint-stylish'
    ).pipe(lint.reporter 'fail')
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.init())
    pipe = pipe.pipe(coffee()).pipe(concat("#{out_filename}.js")).pipe(uglify(
      "mangle": true
    ))
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.write())
    pipe = pipe.pipe(g.dest dest)
