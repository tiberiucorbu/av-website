(function(w, $, Swiper) {
  "use strict";

  var swiperOpts = {
        pagination: '.swiper-pagination',
        paginationClickable: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 30,
        hashnav: true
    };

  var initSwiper = function(el) {
    var swiperInstance = Swiper(el, swiperOpts);
    $(el).data('swiperInstance', swiperInstance);
  };

  $(function() {
    $('[data-target="swiper"]').each(function(idx, el) {
      if (!$(el).data('deffer-load')) {
        initSwiper(el);
      }
    });
  });

})(window, jQuery, Swiper);
