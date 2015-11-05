gulp = require('gulp-help') require 'gulp'
$ = do require 'gulp-load-plugins'
config = require '../config'
paths = require '../paths'
util = require '../util'


gulp.task 'html', false, ->
  for key of config
    if not config[key].html
      continue
    gulp.src config[key].html
    .pipe $.plumber errorHandler: util.onError
    .pipe gulp.dest "#{paths.static.root}/html/#{key}"


gulp.task 'html:dev', false, ->
  for key of config
    if not config[key].html
      continue
    gulp.src config[key].html
    .pipe $.plumber errorHandler: util.onError
    .pipe gulp.dest "#{paths.static.root}/html/#{key}"
