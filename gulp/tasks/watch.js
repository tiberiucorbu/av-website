var $, gulp, paths;

gulp = require('gulp-help')(require('gulp'));

$ = require('gulp-load-plugins')();

paths = require('../paths');

gulp.task('reload', false, function () {
  $.livereload.listen();
  return gulp.watch([paths["static"].dev + "/**/*.{css,js}", paths.main + "/**/*.{html,py}"]).on('change', $.livereload.changed);
});

gulp.task('ext_watch_rebuild', false, function (callback) {
  return $.sequence('clean:dev', 'copy_bower_files', 'ext:dev', 'style:dev')(callback);
});

gulp.task('watch', false, function () {
  gulp.watch('requirements.txt', ['pip']);
  gulp.watch('package.json', ['npm']);
  gulp.watch('bower.json', ['ext_watch_rebuild']);
  gulp.watch('gulp/config.js', ['ext:dev', 'style:dev', 'script:dev']);
  gulp.watch(paths["static"].ext, ['ext:dev']);
  gulp.watch(paths.src.script + "/**/*.js", ['ext:dev']);
  gulp.watch(paths.src.html + "/**/*.html", ['ng-templates']);
  gulp.watch(paths.src.script + "/**/*.coffee", ['script:dev']);
  return gulp.watch(paths.src.style + "/**/*.less", ['style:dev']);
});
