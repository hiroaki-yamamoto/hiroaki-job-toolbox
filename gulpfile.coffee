g = require "gulp"
coffee = require "gulp-coffee"
lint = require "gulp-coffeelint"
notify = require "gulp-notify"
plumber = require "gulp-plumber"

g.task "compile", ->
  g.src("src/**/*.coffee").pipe(
    plumber(errorHandler: notify.onError '<%= error.message %>')
  ).pipe(lint(
    "arrow_spacing": "error",
    "braces_spacing": "error",
    "spacing_after_comma": "error",
    "cyclomatic_complexity": "error",
    "line_endings": "error",
    "no_interpolation_in_single_quotes": "error",
    "no_stand_alone_at": "error"
  )).pipe(
    lint.reporter 'coffeelint-stylish'
  ).pipe(lint.reporter 'fail').pipe(coffee()).pipe g.dest "./lib"

g.task "default", ->
  g.watch "./src/**/*.coffee", ["compile"]
