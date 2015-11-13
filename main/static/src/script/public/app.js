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

    function init(){
      console.log('hey hey hey')
    }

    $swiperModalEl.modal('hide'); // init the modal
    document.onreadystatechange = function(){
      if (document.readyState === "interactive") {
        init();
      }
    };
    document.addEventListener("DOMContentLoaded", function(event) {
        init();
    });

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
