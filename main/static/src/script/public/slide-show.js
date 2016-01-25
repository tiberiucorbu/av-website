(function(w, $){
  'use strict';

  var ga = window.ga || function(){};

  var Slideshow = function(el){
    this.el = el;

    this.init();
  };

  Slideshow.prototype.init = function(){
    if (!this.el) {
      return;
    }
    this.slides = this.el.find('.item');
    var that = this;
    this.el.find('[data-slideshow-slide="prev"]')
      .on('click', function(e){e.preventDefault(); that.prev();}).attr('href', '#'+this.el.attr('id'));
    this.el.find('[data-slideshow-slide="next"]')
      .on('click', function(e){e.preventDefault(); that.next();}).attr('href', '#'+this.el.attr('id'));
    this.currentIndex = this.el.data('active') || 1;
    //this.goto(this.currentIndex);
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
    ga('send', 'event', 'Story', 'Slideshow', 'Previous', 'previous' );
    this.goto(nextIdx);
  };

  Slideshow.prototype.next = function(){
    var nextIdx = (this.currentIndex + 1) % this.slides.length;
    ga('send', 'event', 'Story', 'Slideshow', 'Next', 'next');
    this.goto(nextIdx);
  };

  window.Slideshow = Slideshow;

})(window, jQuery);
