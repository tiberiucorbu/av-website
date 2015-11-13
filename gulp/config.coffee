paths = require './paths'
# Configuration for the front office scripts
config = {}

config.admin_app =
  ext: [
    "#{paths.src.script}/admin/app.js"
    "#{paths.src.script}/admin/app/**/*.js"
  ]
  html : [
    "#{paths.src.html}/admin/**/*.html"
  ]

config.front =
  ext: [
    "#{paths.static.ext}/jquery/dist/jquery.js"
    "#{paths.static.ext}/moment/moment.js"
    "#{paths.static.ext}/bootstrap/js/collapse.js"
    "#{paths.static.ext}/bootstrap/js/dropdown.js"
    "#{paths.static.ext}/bootstrap/js/tooltip.js"
    "#{paths.static.ext}/bootstrap/js/carousel.js"
    "#{paths.static.ext}/swiper/dist/js/swiper.js"
    "#{paths.src.script}/public/**/*.js"
  ]
  style: [
    "#{paths.src.style}/public/style.less"
  ]


# Configuration for the backoffice scripts
config.admin =
  ext: [
    "#{paths.static.ext}/jquery/dist/jquery.js"
    "#{paths.static.ext}/moment/moment.js"
    "#{paths.static.ext}/nprogress/nprogress.js"
    "#{paths.static.ext}/bootstrap/js/alert.js"
    "#{paths.static.ext}/bootstrap/js/button.js"
    "#{paths.static.ext}/bootstrap/js/transition.js"
    "#{paths.static.ext}/bootstrap/js/collapse.js"
    "#{paths.static.ext}/bootstrap/js/dropdown.js"
    "#{paths.static.ext}/bootstrap/js/tooltip.js"
    "#{paths.static.ext}/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"
    "#{paths.static.ext}/angular/angular.js"
    "#{paths.static.ext}/sortable/Sortable.js"
    "#{paths.static.ext}/sortable/ng-sortable.js"
    "#{paths.static.ext}/marked/lib/marked.js"
    "#{paths.static.ext}/angular-marked/angular-marked.js"
    "#{paths.static.ext}/angular-bootstrap/ui-bootstrap-tpls.js"
    "#{paths.static.ext}/angular-upload/angular-upload.js"
    "#{paths.static.ext}/ng-tags-input/ng-tags-input.min.js"
    "#{paths.src.script}/common/util/**/*.js"

  ]
  style: [
    "#{paths.src.style}/private/style.less"
  ]
  script: [
    "#{paths.src.script}/**/*.coffee"
  ]

module.exports = config
