(function(w, $){
  'use strict';

  var timerId;

  var imageLoadQueue = [];

   var scheduleImageLoader = function(){
     if (timerId){
       clearTimeout(timerId);
       timerId = null;
     }
     for (var i = 0; i<6; i++){
       var img = imageLoadQueue.shift();
       if (img){
         img.attr('src', img.data('src'));
         img.removeClass('not-loaded-image');
       }
     }
     if (imageLoadQueue.length){
      timerId =  setTimeout(scheduleImageLoader, 500);
     }
   };


   var elementInViewport = function(el) {
     if (!el){
       return false;
     }
     var top = el.offsetTop;
     var left = el.offsetLeft;
     var width = el.offsetWidth;
     var height = el.offsetHeight;

     while(el.offsetParent) {
       el = el.offsetParent;
       top += el.offsetTop;
       left += el.offsetLeft;
     }

     return (
       top < (window.pageYOffset + window.innerHeight) &&
       left < (window.pageXOffset + window.innerWidth) &&
       (top + height) > window.pageYOffset &&
       (left + width) > window.pageXOffset
     );
   }
   var $nodes = $('img');

   $(document).on("DOMContentLoaded", function(event) {
       $nodes.each(function(idx, el){
         var $img = $(this);
         var src = $img.attr('src');
         $img.attr('src', '').data('src', src);
         $img.addClass('not-loaded-image');
       });
   });

   var checkImagesInViewport = function(){
      var $imgs = $('.not-loaded-image');
      if ($imgs.length === 0){
        $(window).off('load scroll resize', checkImagesInViewport);
      }
      $imgs.each(function(idx){
        var $img = $(this);
        if (elementInViewport($img[0])){
          imageLoadQueue.push($img);
        }
      });
      scheduleImageLoader();
   };

   $(window).on('load scroll resize', checkImagesInViewport);

   scheduleImageLoader();

 })(window, jQuery);
