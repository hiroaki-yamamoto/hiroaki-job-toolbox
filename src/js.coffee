# Javascript gulp tasks

g = require "gulp"
concat = require "gulp-concat"
linter = require "gulp-eslint"
plumber = require "gulp-plumber"
notify = require "gulp-notify"
uglify = require "gulp-uglify"

helper = require("./helper")

module.exports = (pkgname, dest, blacklist, dependencies=[],
frontendOnly=true, frontendDir="frontend") ->
  thirdPartyBlackLists = helper.thirdPartyBlackLists.concat blacklist
  blacklist = "!(#{thirdPartyBlackLists.join '|'})"
  frontend = if frontendOnly then "" else "#{frontendDir}/"
  srcName = "#{packageName}/**/#{blacklist}/**/js/#{frontend}**/*.js"

  g.src(srcName).pipe(
    plumber(errorHandler: notify.onError '<%= error.message %>')
  ).pipe(linter("configFile": "./eslint.js")).pipe(concat("assets.js"))
