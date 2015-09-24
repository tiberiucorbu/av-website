gulp = require('gulp-help') require 'gulp'
$ = do require 'gulp-load-plugins'
config = require '../config'
paths = require '../paths'
util = require '../util'


gulp.task 'script', false, ->
  for key of config
    gulp.src config[key].script
    .pipe $.plumber errorHandler: util.onError
    .pipe $.coffee()
    .pipe $.concat key+'_script.js'
    .pipe do $.uglify
    .pipe $.size {title: 'Minified scripts'}
    .pipe gulp.dest "#{paths.static.min}/script"


gulp.task 'script:dev', false, ->
  for key of config
    gulp.src config[key].script
    .pipe $.plumber errorHandler: util.onError
    .pipe do $.sourcemaps.init
    .pipe $.coffee()
    .pipe $.concat key+'_script.js'
    .pipe do $.sourcemaps.write
    .pipe gulp.dest "#{paths.static.dev}/script"
