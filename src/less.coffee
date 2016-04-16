# Less gulp tasks

g = require "gulp"
autoprefix = require "gulp-autoprefixer"
less = require "gulp-less"
notify = require "gulp-notify"
plumber = require "gulp-plumber"
rename = require "gulp-rename"
CleanLESS = require "less-plugin-clean-css"

helper = require "./helper"

module.exports = (pkgname, blacklist, dest) ->
  thirdPartyBlackLists = helper.blacklist.concat blacklist
  g.task "less", ->
    pipe = g.src("#{pkgname}/main.less").pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    )
    if process.env.CI or process.env.mode is "production"
      pipe = pipe.pipe(sourcemaps.init())
    pipe = pipe.pipe(
      less("plugins": [
        new CleanLESS(("advanced": true ,"rebase": true))
      ])
    ).pipe(autoprefix())
    if process.env.CI or process.env.mode is "production"
      pipe = pipe.pipe(sourcemaps.write())
    pipe = pipe.pipe(g.dest(dest))
