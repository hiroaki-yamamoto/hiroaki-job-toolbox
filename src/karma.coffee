###
karma tasks
###

g = require "gulp"
karma = require "gulp-karma-runner"
plumber = require "gulp-plumber"
notify = require "gulp-notify"

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

module.exports = (packageName, third_party, frontendOnly=true) ->
  jsFiles = "**/js/#{if frontendOnly "" else "frontend/"}**/*.js"
  srcName = [
    "#{package}/**/js/#{if frontendOnly "" else "frontend/"}**/*.js",
    "tests/**/js/#{if frontendOnly "" else "frontend/"}unit/**/*.js"
  ]
  srcName = srcName.concat third_party
  g.task "karma.server", ->
    g.src(srcName).pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    ).pipe(karma.server config)
  g.task "karma.runner", ->
    g.src(srcName).pipe(
      plumber(errorHandler: notify.onError '<%= error.message %>')
    ).pipe(karma.runner config)
