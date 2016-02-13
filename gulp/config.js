var config, paths;

paths = require('./paths');

config = {};

config.admin_app = {
  ext: [paths.src.script + "/admin/app.js", paths.src.script + "/admin/app/**/*.js"],
  html: [paths.src.html + "/admin/**/*.html"]
};

var path_static = paths["static"];
var path_ext = path_static.ext;
config.front = {
  ext: [path_ext + "/jquery/dist/jquery.js", path_ext + "/moment/moment.js",
    path_ext + "/bootstrap/js/collapse.js",
    path_ext + "/bootstrap/js/dropdown.js",
    path_ext + "/bootstrap/js/tooltip.js",
    path_ext + "/bootstrap/js/carousel.js",
    path_ext + "/bootstrap/js/modal.js",
    path_ext + "/bootstrap/js/transition.js",
    paths.dep.bower_components + "/image-scale/image-scale.min.js",
    paths.src.script + "/public/**/*.js"],
  style: [paths.src.style + "/public/style.less"]
};

config.admin = {
  ext: [path_ext + "/jquery/dist/jquery.js", path_ext + "/moment/moment.js",
    path_ext + "/nprogress/nprogress.js",
    path_ext + "/bootstrap/js/alert.js",
    path_ext + "/bootstrap/js/button.js",
    path_ext + "/bootstrap/js/transition.js",
    path_ext + "/bootstrap/js/collapse.js",
    path_ext + "/bootstrap/js/dropdown.js",
    path_ext + "/bootstrap/js/tooltip.js",
    path_ext + "/bootstrap/js/tab.js",
    path_ext + "/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js",
    path_ext + "/angular/angular.js", path_ext + "/sortable/Sortable.js",
    path_ext + "/sortable/ng-sortable.js",
    path_ext + "/marked/lib/marked.js",
    path_ext + "/angular-marked/dist/angular-marked.js",
    path_ext + "/angular-bootstrap/ui-bootstrap-tpls.js",
    path_ext + "/angular-upload/angular-upload.js",
    path_ext + "/ng-tags-input/ng-tags-input.min.js",
    paths.src.script + "/common/util/**/*.js"],
  style: [paths.src.style + "/private/style.less"],
  script: [paths.src.script + "/**/*.coffee"]
};

module.exports = config;
