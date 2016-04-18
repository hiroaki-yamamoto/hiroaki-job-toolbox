# Less gulp tasks

g = require "gulp"
autoprefix = require "gulp-autoprefixer"
cleancss = require "gulp-cleancss"
notify = require "gulp-notify"
plumber = require "gulp-plumber"
rename = require "gulp-rename"
sass = require "gulp-sass"

helper = require "./helper"

module.exports = (taskPrefix, pkgname, blacklist, dest) ->
  thirdPartyBlackLists = helper.thirdPartyBlackLists.concat blacklist
  g.task "#{taskPrefix}less", ->
    pipe = g.src("#{pkgname}/main.scss").pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    )
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.init())
    pipe = pipe.pipe(sass()).pipe(
      cleancss(("advanced": true ,"rebase": true))
    ).pipe(autoprefix()).pipe(rename "basename": "assets")
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.write())
    pipe = pipe.pipe(g.dest(dest))
