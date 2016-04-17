# Coffeescript compiler for frontend.
# Backend? just run as-it-is!

g = require "gulp"

concat = require "gulp-concat"
coffee = require "gulp-coffee"
linter = require "gulp-coffeelint"
notify = require "gulp-notify"
plumber = require "gulp-plumber"
sourcemaps = require "gulp-sourcemaps"
uglify = require "gulp-uglify"

helper = require "./helper"

module.exports = (taskPrefix, pkgname, dest, blacklist, dependencies=[],
frontendOnly=true, frontendDir="frontend") ->
  thirdPartyBlackLists = helper.thirdPartyBlackLists.concat blacklist
  blacklist = "!(#{thirdPartyBlackLists.join '|'})"
  frontend = if frontendOnly then "" else "#{frontendDir}/"
  srcName = "#{packageName}/**/#{blacklist}/**/coffee/#{frontend}**/*.coffee"

  gulp.task "#{taskPrefix}coffee", dependencies, ->
    pipe = g.src(srcName).pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    ).pipe(lint(
      "arrow_spacing": "error"
      "braces_spacing": "error"
      "spacing_after_comma": "error"
      "cyclomatic_complexity": "error"
      "line_endings": "error"
      "no_interpolation_in_single_quotes": "error"
      "no_stand_alone_at": "error"
    )).pipe(
      lint.reporter 'coffeelint-stylish'
    ).pipe(lint.reporter 'fail')
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.init())
    pipe = pipe.pipe(coffee()).pipe(concat("./assets.js")).pipe(uglify(
      "mangle": true
    ))
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.write())
    pipe = pipe.pipe(g.dest dest)
