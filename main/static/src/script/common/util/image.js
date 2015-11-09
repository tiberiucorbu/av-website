(function(window) {
  var imageUtil = window.imageUtil || {};
  window.imageUtil = imageUtil;

  imageUtil.loadFileToImageEl = function(file, callback){
    if (file.type.indexOf('image') === 0){
      var img = new Image();   // Create new img element

      var reader = new FileReader();
      reader.onload = function(e){
        img.addEventListener("load", function() {
          callback(img);
        }, false);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  imageUtil.computeAverageRGB = function(imgEl) {
    if (!imgEl){
      return;
    }
    var blockSize = 5, // only visit every 5 pixels
      defaultRGB = {
        r: 0,
        g: 0,
        b: 0
      }, // for non-supporting envs
      canvas = document.createElement('canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      data, width, height,
      i = -4,
      length,
      rgb = {
        r: 0,
        g: 0,
        b: 0
      },
      count = 0;

    if (!context) {
      return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      /* security error, img on diff domain */
      return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;

  }
})(window);
