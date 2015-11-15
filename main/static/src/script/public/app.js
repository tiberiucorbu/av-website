(function(w, $, Swiper) {
  "use strict";

  var swiperOpts = {
    pagination: '.swiper-pagination',
    paginationClickable: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    spaceBetween: 30,
  };

  var initSwiper = function(el) {
    var swiperInstance = Swiper(el, swiperOpts);
    $(el).data('swiperInstance', swiperInstance);
  };

  var decorateSwiperElements = function(){
    $('[data-target="swiper"]').each(function(idx, el) {
      if (!$(el).data('deffer-load') && !$(el).data('swiperInstance')) {
        initSwiper(el);
      }
    });
  };

  $(function() {
    decorateSwiperElements();
  });


  $(function() {

    var $swiperModalEl = $('#swiper-modal-container');

    $swiperModalEl.modal('hide'); // init the modal

    $('[data-target="open-modal-swiper"]').each(function(idx, el) {
      var $el = $(el);
      var href = $el.attr('href');
      if (href) {
        $el.on('click', function(e) {
          e.preventDefault();
          $.ajax({
            url: href,
            data: {
              m: 'gallery',
              v: 'r'
            },
            success: function(res) {

              $swiperModalEl
                .find('.modal-body').eq(0)
                .html(res);
              window.setTimeout(function(){
                decorateSwiperElements();
              }, 500);
              $swiperModalEl.modal('show');
            },
            error: function(res) {
              window.location.href = href;
            }
          });
        });
      }
    });

    var mapValue = function(x, inMin, inMax, outMin, outMax){
      return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    };

    var proportionalHeight = function(el){
      var $el = $(el);
      var containerWidth = $el.parent().width();
      var containerHeight = $el.parent().height();

      var childsWidth = 0;
      var childsMaxHeight = 0;
      $el.children().each(function(idx, child){
        var $child = $(child);
        childsMaxHeight = Math.max(childsMaxHeight, $child.outerHeight());
        childsWidth = childsWidth + $child.outerWidth();
      });

      var r = childsWidth / childsMaxHeight;
      var height = Math.round(containerWidth / r);
      $el.height(height);
      setTimeout(function(){ proportionalHeight(el);}, 500);
    };



    $('[data-target="optimal-size"]').each(function(idx, el) {
        proportionalHeight(el);



    });
  });

})(window, jQuery, Swiper);
