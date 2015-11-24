(function(window) {

  "use strict";

  var reflectionUtil = window.reflectionUtil || {};
  window.reflectionUtil = reflectionUtil;
  reflectionUtil.toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  };

})(window);
