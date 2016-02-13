var gulp = require('gulp-help')(require('gulp'));

var $ = require('gulp-load-plugins')();

var config = require('../config');

var paths = require('../paths');

var util = require('../util');

var path = paths.src.html;

var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

gulp.task('ng-templates', false, function () {
  var key, results;
  results = [];
  for (key in config) {
    if (!config[key].html) {
      continue;
    }

    var pipe = gulp.src(config[key].html)
      .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(ngHtml2Js({
        moduleName: "adminApp",
        prefix: "/p/html/admin/"
      }))
      .pipe($.concat(key + '_template_script.js'))
      .pipe(uglify())
      .pipe($.size({title: 'Minified template in scripts scripts'}))
      .pipe(gulp.dest(paths["static"].min + "/script"));

    results.push(pipe);
  }
  return results;
});


