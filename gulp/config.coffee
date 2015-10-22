paths = require './paths'
# Configuration for the front office scripts
config = {}

config.fe =
  ext: [
    "#{paths.static.ext}/jquery/dist/jquery.js"
    "#{paths.static.ext}/moment/moment.js"
    "#{paths.static.ext}/bootstrap/js/alert.js"
    "#{paths.static.ext}/bootstrap/js/button.js"
    "#{paths.static.ext}/bootstrap/js/transition.js"
    "#{paths.static.ext}/bootstrap/js/collapse.js"
    "#{paths.static.ext}/bootstrap/js/dropdown.js"
    "#{paths.static.ext}/bootstrap/js/tooltip.js"


  ]
  style: [
    "#{paths.src.style}/public/style.less"
  ]
  script: [
    "#{paths.src.script}/**/*.coffee"
  ]

# Configuration for the backoffice scripts
config.be =
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

  ]
  style: [
    "#{paths.src.style}/private/style.less"
  ]
  script: [
    "#{paths.src.script}/**/*.coffee"
  ]

module.exports = config
