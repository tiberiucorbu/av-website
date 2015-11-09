(function(window) {

  "use strict";

  var imageUtil = window.imageUtil || {};
  window.imageUtil = imageUtil;

  imageUtil.loadFileToImageEl = function(file, callback) {
    if (file.type.indexOf('image') === 0) {
      var img = new Image(); // Create new img element

      var reader = new FileReader();
      reader.onload = function(e) {
        img.addEventListener('load', function() {
          callback(img);
        }, false);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  imageUtil.getSize = function(imgEl, maxSize) {

    var height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    var width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    var scaledH, scaledW;

    if (height > width) {
      scaledH = maxSize;
      scaledW = window.mathCalcsUtil.map(width, 0, height, 0, maxSize);
    } else {
      scaledH = window.mathCalcsUtil.map(height, 0, width, 0, maxSize);
      scaledW = maxSize;
    }
    return {
      origW: width,
      origH: height,
      scaledW: scaledW,
      scaledH: scaledH
    };

  };
  imageUtil.loadImgToCanvas = function(imgEl, scaleToSize) {
    if (!imgEl) {
      return;
    }
    var size = imageUtil.getSize(imgEl, scaleToSize),
      canvas = document.createElement("canvas"),
      context = canvas.getContext && canvas.getContext('2d');
    canvas.width = size.scaledW;
    canvas.height = size.scaledH;
    context.drawImage(imgEl, 0, 0, size.origW, size.origH, 0, 0, size.scaledW, size.scaledH);

    return {
      canvas: canvas,
      size: size
    };
  };
  imageUtil.computeAverageRGB = function(canvas, size) {
    var result = {
      r: 0,
      g: 0,
      b: 0
    };
    if (!canvas) {
      return result;
    }
    var blockSize = 5, // only visit every 5 pixels
      context = canvas.getContext && canvas.getContext('2d'),
      data,
      width = size.scaledW,
      height = size.scaledH,
      i = -4,
      length,
      rgb = {
        r: 0,
        g: 0,
        b: 0
      },
      count = 0;


    if (!context) {
      return result;
    }
    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      /* security error, img on diff domain */
      return result;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = Math.round(rgb.r / count);
    rgb.g = Math.round(rgb.g / count);
    rgb.b = Math.round(rgb.b / count);
    return rgb;

  };
})(window);
