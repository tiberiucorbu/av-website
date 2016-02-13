var $, gulp, requireDir;

gulp = require('gulp-help')(require('gulp'));

requireDir = require('require-dir')('./gulp/tasks');

$ = require('gulp-load-plugins')();

var help = 'Start the local server, watch for changes and reload browser automatically. For available options refer to "run" task.';

gulp.task('default', help, $.sequence('run', ['watch', 'reload']));
