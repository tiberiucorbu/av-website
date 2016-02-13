var $, fs, gulp, main_bower_files, paths;

fs = require('fs');

gulp = require('gulp-help')(require('gulp'));

main_bower_files = require('main-bower-files');

$ = require('gulp-load-plugins')();

paths = require('../paths');

gulp.task('npm', false, function () {
  return gulp.src('package.json').pipe($.plumber()).pipe($.start());
});

gulp.task('bower', false, function () {
  var cmd, start_map;
  cmd = 'node_modules/.bin/bower install';
  if (/^win/.test(process.platform)) {
    cmd = cmd.replace(/\//g, '\\');
  }
  start_map = [
    {
      match: /bower.json$/,
      cmd: cmd
    }
  ];
  return gulp.src('bower.json').pipe($.plumber()).pipe($.start(start_map));
});

gulp.task('copy_bower_files', false, ['bower'], function () {
  return gulp.src(main_bower_files(), {
    base: paths.dep.bower_components
  }).pipe(gulp.dest(paths["static"].ext));
});

gulp.task('pip', false, function () {
  return gulp.src('run.py').pipe($.start([
    {
      match: /run.py$/,
      cmd: 'python run.py -d'
    }
  ]));
});

gulp.task('zip', false, function () {
  return fs.exists(paths.py.lib_file, function (exists) {
    if (!exists) {
      return fs.exists(paths.py.lib, function (exists) {
        if (exists) {
          return gulp.src(paths.py.lib + "/**").pipe($.plumber()).pipe($.zip('lib.zip')).pipe(gulp.dest(paths.main));
        }
      });
    }
  });
});

gulp.task('install_dependencies', false, $.sequence('npm', 'pip', 'copy_bower_files'));
