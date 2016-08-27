# Less gulp tasks

g = require "gulp"
autoprefix = require "gulp-autoprefixer"
cleancss = require "gulp-cleancss"
notify = require "gulp-notify"
plumber = require "gulp-plumber"
rename = require "gulp-rename"
sass = require "gulp-sass"
sourcemaps = require "gulp-sourcemaps"

helper = require "./helper"

module.exports = (taskPrefix, pkgname, dest, out_filename="assets") ->
  g.task "#{taskPrefix}scss", ->
    pipe = g.src("#{pkgname}/main.scss").pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    )
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.init())
    pipe = pipe.pipe(sass()).pipe(
      cleancss(("advanced": true ,"rebase": true))
    ).pipe(autoprefix()).pipe(rename "basename": out_filename)
    if not helper.isProduction
      pipe = pipe.pipe(sourcemaps.write())
    pipe = pipe.pipe(g.dest(dest))
