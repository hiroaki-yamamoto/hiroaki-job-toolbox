helper = require "hyamamoto-job-toolbox"

module.exports =
    "basePath": "./"
    "quiet": true
    "frameworks": ["mocha", "chai", "sinon"]
    "reporters": ["progress"]
    "colors": true
    "logLevel": "INFO"
    "autoWatch": false
    "singleRun": helper.isProduction
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
