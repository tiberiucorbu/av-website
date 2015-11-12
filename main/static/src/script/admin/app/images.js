(function(window) {
  "use strict";

  var app = window.app;

  var imageUploadThumbsPreviewDirective = function() {
    return {
      scope: {
        items: '=items'
      },
      replace: true,
      templateUrl: '/p/html/admin_app/image_upload_thumbs_preview.html',
      //link: function(scope, el, attr) {
        // console.log('imageUploadThumbsPreview', scope);
      //}
    };
  };

  app.directive('imageUploadThumbsPreview', imageUploadThumbsPreviewDirective);

  var imageUploadThumbPreviewDirective = function() {
    return {
      scope: {
        item: '=item'
      },
      replace: true,
      templateUrl: '/p/html/admin_app/image_upload_thumb_preview.html',
      link: function(scope) {
        scope.isUploadComplete = function() {
          return scope.item.progress ?
            scope.item.progress.percentage === 100 :
            false;
        };
        console.log('imageUploadThumbnail', scope);
      }
    };
  };

  app.directive('imageUploadThumbPreview', imageUploadThumbPreviewDirective);

  var imageUploadFormDirective = function() {

    var toHex = function(color) {
      return '#' + ('00000' + (color.r << 16 | color.g << 8 | color.b).toString(16)).slice(-6);
    };

    var buildItemFromFile = function(file) {
      return {
        file: file
      };
    };

    var findItemByFile = function(items, file) {
      var result = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].file === file) {
          result = items[i];
          break;
        }
      }
      return result;
    };

    var buildUploadHandler = function(previewCallback, progressCallback) {
      return {
        preview: function(file) {
          if (previewCallback) {
            previewCallback(file);
          }
          return progressCallback;
        }
      };
    };

    var initResourceUpload = function(el, callbackHandler) {
      var fileUploader = null;
      if (window.File && window.FileList && window.FileReader) {

        var fileUploaderConfig = {
          upload_handler: callbackHandler,
          selector: $('.file', el),
          drop_area: $('.drop-area', el),
          confirm_message: 'Files are still being uploaded.',
          upload_url: $('.file', el).data('get-upload-url'),
          allowed_types: [],
          max_size: 1024 * 1024 * 1024
        };

        fileUploader = new window.FileUploader(fileUploaderConfig);
      }
      return fileUploader;
    };

    var fileUploader;

    return {
      scope: {
        items: '='
      },
      templateUrl: '/resource/upload/?v=only-html',
      link: function(scope, el, attr) {
        // Hmm some things to reuse - not angularish but working as a charm
        window.prettyFile();
        var items = scope.items;
        var resourceProgressCallback = function(progress, resource, error, file) {
          var item = findItemByFile(items, file);
          item.progress = {
            percentage: progress
          };
          item.resource = resource;
          item.error = error;
        };

        var previewUploadCallback = function(file) {
          var item = buildItemFromFile(file);

          window.imageUtil.loadFileToImageEl(file, function(img) {
            var scaledCanvas = window.imageUtil.loadImgToCanvas(img, 160);
            var color = window.imageUtil.computeAverageRGB(scaledCanvas.canvas, scaledCanvas.size);


            img = null; // free up the space since we don't need the image anymore
            scope.$apply(function() {
              item.color = toHex(color);
              try {
                item.thumbnailDataUrl = scaledCanvas.canvas.toDataURL("image/jpeg", 0.8);
              } catch (e) {
                // it may fail on cross domain images
              }

            });
          });
          scope.$apply(function() {
            items.push(item);
          });
        };

        var handler = buildUploadHandler(previewUploadCallback, resourceProgressCallback);
        fileUploader = initResourceUpload(el, handler);

      }
    };
  };

  app.directive('imageUploadForm', imageUploadFormDirective );

  var imagesSelectController = function($scope) {
    console.log($scope);
  };

  app.controller('imagesSelectController', ['$scope', imagesSelectController]);

})(window);
