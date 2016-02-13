var del, gulp, paths;

del = require('del');

gulp = require('gulp-help')(require('gulp'));

paths = require('../paths');

gulp.task('clean', 'Clean project from temporary files, generated CSS & JS and compiled Python files.', function () {
  del('./**/*.pyc');
  del('./**/*.pyo');
  return del('./**/*.~');
});

gulp.task('clean:dev', false, function () {
  del(paths["static"].ext);
  return del(paths["static"].dev);
});

gulp.task('clean:min', false, function () {
  del(paths["static"].ext);
  return del(paths["static"].min);
});

gulp.task('clean:venv', false, function () {
  del(paths.py.lib);
  del(paths.py.lib_file);
  del(paths.dep.py);
  return del(paths.dep.py_guard);
});

gulp.task('reset', 'Complete reset of project. Run "npm install" after this procedure.', ['clean', 'clean:dev', 'clean:min', 'clean:venv'], function () {
  del(paths.dep.bower_components);
  return del(paths.dep.node_modules);
});

gulp.task('flush', 'Clear local datastore, blobstore, etc.', function () {
  return del(paths.temp.storage);
});
