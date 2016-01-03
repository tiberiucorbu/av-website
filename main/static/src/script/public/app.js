(function(w, $) {
  "use strict";

  var initSlideshow = function(el) {
    var slideShow = new w.Slideshow(el);
    $(el).data('slideshowInstance', slideShow);
  };

  var decorateSlideshowElements = function(){
    $('[data-target="slideshow"]').each(function(idx, el) {
      console.log(el);
      if (!$(el).data('deffer-load') && !$(el).data('slideshowInstance')) {
        initSlideshow($(el));
      }
    });
  };

  $(function() {
    decorateSlideshowElements();
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
                .find('.slideshow-wrapper').eq(0)
                .html(res);
              window.setTimeout(function(){
                decorateSlideshowElements();
                $swiperModalEl.find('.close').on('click', function(){
                    $swiperModalEl.modal('hide');
                });
              }, 500);
              $swiperModalEl.modal('show');
            },
            error: function() {
              window.location.href = href;
            }
          });
        });
      }
    });
  });

  $(function() {

    $('[data-toggle="menu"]').each(function(idx, el) {
      var $el = $(el);

      var toggle = function(e){

            $el.parent().toggleClass('open');
            $el.find('.caret').toggleClass('up');
            e.preventDefault();



      };
      $el.on('click', toggle);
    });
  });

})(window, jQuery);
