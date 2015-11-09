(function(window) {

  "use strict";

  var mathCalcsUtil = window.mathCalcsUtil || {};
  window.mathCalcsUtil = mathCalcsUtil;

   mathCalcsUtil.map = function(x, inMin, inMax, outMin, outMax){
     return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
   };


})(window);
