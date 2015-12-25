(function(w, $){
  'use strict';
  var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";

  var handler = function(e) {

    kkeys.push( e.keyCode );

    if ( kkeys.toString().indexOf( konami ) >= 0 ) {

      $(document).unbind('keydown', handler);

      $("body").addClass("egg");
    }

  };

  $(document).keydown(handler);

})(window, jQuery);
