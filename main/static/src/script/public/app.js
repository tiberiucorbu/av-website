(function(w, $, Swiper) {
  "use strict";

  var swiperOpts = {
    pagination: '.swiper-pagination',
    paginationClickable: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 'auto',
    scrollbar: '.swiper-scrollbar',
    //centeredSlides: true,
    freeMode: true,
    spaceBetween: 30,
    grabCursor: true
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
  });

})(window, jQuery, Swiper);
