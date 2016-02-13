var $, config, gulp, paths, util;

gulp = require('gulp-help')(require('gulp'));

$ = require('gulp-load-plugins')();

config = require('../config');

paths = require('../paths');

util = require('../util');

gulp.task('ext', false, function () {
  var key, results;
  results = [];
  for (key in config) {
    if (!config[key].ext) {
      continue;
    }
    results.push(gulp.src(config[key].ext).pipe($.plumber({
      errorHandler: util.onError
    })).pipe($.concat(key + '_ext.js')).pipe($.uglify()).pipe($.size({
      title: 'Minified ext libs'
    })).pipe(gulp.dest(paths["static"].min + "/script")));
  }
  return results;
});

gulp.task('ext:dev', false, function () {
  var key, results;
  results = [];
  for (key in config) {
    if (!config[key].ext) {
      continue;
    }
    results.push(gulp.src(config[key].ext).pipe($.plumber({
      errorHandler: util.onError
    })).pipe($.sourcemaps.init()).pipe($.concat(key + '_ext.js')).pipe($.sourcemaps.write()).pipe(gulp.dest(paths["static"].dev + "/script")));
  }
  return results;
});
