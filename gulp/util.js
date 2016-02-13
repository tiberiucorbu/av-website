var $, onError;

$ = require('gulp-load-plugins')();

onError = function (err) {
  $.util.beep();
  console.log(err);
  return this.emit('end');
};

module.exports = {
  onError: onError
};
