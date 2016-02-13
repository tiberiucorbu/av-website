var $, gulp, minimist, paths;

gulp = require('gulp-help')(require('gulp'));

minimist = require('minimist');

$ = require('gulp-load-plugins')();

paths = require('../paths');

gulp.task('build',
  "Build project to prepare it for a deployment. Minify CSS & JS files and pack Python dependencies into " + paths.py.lib_file + ".",
  $.sequence('clean:min', 'install_dependencies', 'ext', ['script', 'style', 'zip']));

gulp.task('rebuild', 'Re-build project from scratch. Equivalent to "reset" and "build" tasks.',
  $.sequence('reset', 'build'));

gulp.task('deploy', 'Deploy project to Google App Engine.', ['build'], function () {
  var k, options, options_str;
  options = minimist(process.argv);
  delete options['_'];
  options_str = '--skip_sdk_update_check';
  for
    (k in options) {
    if (options[k] === true) {
      options[k] = '';
    }
    options_str += k.length > 1 ? " --" + k + " " + options[k]
      :
    " -" + k + " " + options[k];
  }
  return gulp.src('run.py').pipe($.start([
    {
      match: /run.py$/,
      cmd: "appcfg.py update main " + options_str
    }
  ]));
});

gulp.task('run',
  'Start the local server. Available options:\n -o HOST  - the host to start the dev_appserver.py\n -p PORT  - the port to start the dev_appserver.py\n -a="..." - all following args are passed to dev_appserver.py\n',
  function () {
    return $.sequence('install_dependencies', ['ext:dev', 'ng-templates', 'script:dev', 'style:dev'])(function () {
      var argv, k, known_options, options, options_str;
      argv = process.argv.slice(2);
      known_options = {
        "default": {
          p: '',
          o: '',
          a: ''
        }
      };
      options = minimist(argv, known_options);
      options_str = '-s';
      for
        (k in known_options["default"]) {
        if (options[k]) {
          if (k === 'a') {
            options_str += " --appserver-args \"" + options[k] + "\"";
          } else {
            options_str += " -" + k + " " + options[k];
          }
        }
      }
      return gulp.src('run.py').pipe($.start([
        {
          match: /run.py$/,
          cmd: "python run.py " + options_str
        }
      ]));
    });
  });

