###
karma tasks
###

path = require "path"

g = require "gulp"
karma = require "gulp-karma-runner"
plumber = require "gulp-plumber"
notify = require "gulp-notify"

helper = require "./helper"

module.exports = (taskPrefix, packageName, thirdParty, blacklist,
config, frontendOnly=true, frontendDir="frontend") ->
  thirdPartyBlackLists = helper.thirdPartyBlackLists.concat blacklist
  blacklist = "!(#{thirdPartyBlackLists.join '|'})"
  frontend = if frontendOnly then "" else "#{frontendDir}/"
  srcName = thirdParty.concat [
    "#{packageName}/#{blacklist}/**/js/#{frontend}**/*.js"
    "#{packageName}/#{blacklist}/**/coffee/#{frontend}**/*.coffee"
    "#{packageName}/main.coffee"
    "tests/**/js/#{frontend}unit/**/*.js"
    "tests/**/coffee/#{frontend}unit/**/*.coffee"
  ]
  g.task "#{taskPrefix}karma.server", ->
    g.src(srcName).pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    ).pipe(karma.server config)
  g.task "#{taskPrefix}karma.runner", ->
    g.src(srcName).pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    ).pipe(karma.runner config)
