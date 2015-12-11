(function(w, $){
  'use strict';

  var Slideshow = function(el){
    this.el = el;
    this.init();
  };

  Slideshow.prototype.init = function(){
    this.slides = this.el.find('.item');
    var that = this;
    this.el.find('[data-slide="prev"]')
      .on('click', function(e){e.preventDefault(); that.prev();});
    this.el.find('[data-slide="next"]')
      .on('click', function(e){e.preventDefault(); that.next();});
    this.currentIndex = 0;
    this.goto(this.currentIndex);
  };

  Slideshow.prototype.goto = function(idx){
    this.slides.removeClass('active');
    this.slides.eq(idx).addClass('active');
    this.currentIndex = idx;
  };

  Slideshow.prototype.prev = function(){
    var nextIdx = this.currentIndex - 1;
    if (nextIdx < 0){
      nextIdx = this.slides.length-1;
    }
    this.goto(nextIdx);
  };

  Slideshow.prototype.next = function(){
    var nextIdx = (this.currentIndex + 1) % this.slides.length;
    this.goto(nextIdx);
  };

  window.Slideshow = Slideshow;

})(window, jQuery);
