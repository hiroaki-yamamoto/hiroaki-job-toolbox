# Less gulp tasks

g = require "gulp"
autoprefix = require "gulp-autoprefixer"
less = require "gulp-less"
notify = require "gulp-notify"
plumber = require "gulp-plumber"
rename = require "gulp-rename"
sourcemaps = require "gulp-sourcemaps"
CleanLESS = require "less-plugin-clean-css"

helper = require "./helper"

module.exports = (taskPrefix, pkgname, dest) ->
  g.task "#{taskPrefix}less", ->
    pipe = g.src("#{pkgname}/main.less").pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    )
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.init())
    pipe = pipe.pipe(
      less("plugins": [
        new CleanLESS(("advanced": true ,"rebase": true))
      ])
    ).pipe(autoprefix()).pipe(rename "assets.css")
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.write())
    pipe = pipe.pipe(g.dest(dest))
