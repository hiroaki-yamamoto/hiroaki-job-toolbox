###
karma tasks
###

g = require "gulp"
karma = require "gulp-karma-runner"
plumber = require "gulp-plumber"
notify = require "gulp-notify"

bl = require("./helper").thirdPartyBlackLists

config =
  "basePath": "./"
  "quiet": true
  "frameworks": ["mocha", "chai", "sinon"]
  "reporters": ["progress"]
  "colors": true
  "logLevel": "INFO"
  "autoWatch": false
  "singleRun": process.env.CI or false
  "port": 9876
  "preprocessors":
    "**/*.coffee": ["coffee"]
  "coffeePreprocessor":
    "options":
      "sourceMap": true
  "browsers": ["Chrome", "Firefox", "PhantomJS"]
  "plugins": [
    "karma-mocha"
    "karma-chai-plugins"
    "karma-chrome-launcher"
    "karma-coffee-preprocessor"
    "karma-firefox-launcher"
    "karma-phantomjs-launcher"
    "karma-sinon"
  ]

module.exports = (taskPrefix, packageName, thirdParty, blacklist,
frontendOnly=true, frontendDir="frontend") ->
  thirdPartyBlackLists = bl.concat(blacklist)
  blacklist = "!(#{thirdPartyBlackLists.join '|'})"
  frontend = if frontendOnly then "" else "#{frontendDir}/"
  srcName = [].concat thirdParty
  srcName = srcName.concat [
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
