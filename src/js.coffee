# Javascript gulp tasks

g = require "gulp"
concat = require "gulp-concat"
linter = require "gulp-eslint"
plumber = require "gulp-plumber"
notify = require "gulp-notify"
sourcemaps = require "gulp-sourcemaps"
uglify = require "gulp-uglify"

helper = require "./helper"

module.exports = (taskPrefix, pkgname, dest, blacklist, dependencies=[],
frontendOnly=true, frontendDir="frontend", lintCfg="./etc/eslint.json",
out_filename="assets") ->
  thirdPartyBlackLists = helper.thirdPartyBlackLists.concat blacklist
  blacklist = "!(#{thirdPartyBlackLists.join '|'})"
  frontend = if frontendOnly then "" else "#{frontendDir}/"
  srcName = [
    "#{pkgname}/#{blacklist}/**/js/#{frontend}**/*.js"
    "#{pkgname}/main.js"
  ]

  g.task "#{taskPrefix}js", dependencies, ->
    pipe = g.src(srcName).pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    ).pipe(
      linter("configFile": lintCfg)
    ).pipe(linter.format()).pipe(linter.failAfterError())

    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.init())
    pipe = pipe.pipe(
      concat("#{out_filename}.js")
    ).pipe(uglify "mangle": true)

    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.write())

    pipe = pipe.pipe(g.dest dest)
