var $, config, gulp, paths, util;

gulp = require('gulp-help')(require('gulp'));

$ = require('gulp-load-plugins')();

config = require('../config');

paths = require('../paths');

util = require('../util');

gulp.task('style', false, function () {
  var key, results;
  results = [];
  for (key in config) {
    if (!config[key].style) {
      continue;
    }
    results.push(gulp.src(config[key].style).pipe($.plumber({
      errorHandler: util.onError
    })).pipe($.less()).pipe($.rename(key + '_style.css')).pipe($.autoprefixer({
      cascade: false
    })).pipe($.size({
      title: 'Minified styles'
    })).pipe(gulp.dest(paths["static"].min + "/style")));
  }
  return results;
});

gulp.task('style:dev', false, function () {
  var key, results;
  results = [];
  for (key in config) {
    if (!config[key].style) {
      continue;
    }
    results.push(gulp.src(config[key].style).pipe($.plumber({
      errorHandler: util.onError
    })).pipe($.sourcemaps.init()).pipe($.less()).pipe($.rename(key + '_style.css')).pipe($.autoprefixer({
      map: true
    })).pipe($.sourcemaps.write()).pipe(gulp.dest(paths["static"].dev + "/style")));
  }
  return results;
});
