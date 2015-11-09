var app = window.app;

app.directive('imageUploadThumbsPreview', function() {
  return {
    scope: {
      items: '=items'
    },
    replace: true,
    templateUrl: '/p/html/admin_app/image_upload_thumbs_preview.html',
    link: function(scope, el, attr) {
      // console.log('imageUploadThumbsPreview', scope);
    }
  }
});

app.directive('imageUploadThumbPreview', function() {
  return {
    scope: {
      item: '=item'
    },
    replace: true,
    templateUrl: '/p/html/admin_app/image_upload_thumb_preview.html',
    link: function(scope, el, attr) {
      // console.log('imageUploadThumbnail', scope);
    }
  }
});

app.directive('imageUploadForm', function() {

  var toHex = function(color){
    return '#' + ('00000' + (color.r << 16 | color.g << 8 | color.b).toString(16)).slice(-6);
  };

  var buildItemFromFile = function(file) {
    return {
      file: file
    };
  };

  var findItemByFile = function(items, file){
    var result = null;
    for (var i=0; i<items.length; i++){
      if (items[i].file === file){
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

      fileUploader = new FileUploader(fileUploaderConfig);
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
        item.progress = progress;
        item.resource = resource;
        item.error = error;


      };

      var previewUploadCallback = function(file) {
        var item = buildItemFromFile(file);

        window.imageUtil.loadFileToImageEl(file, function(img){

          var color = window.imageUtil.computeAverageRGB(img);

          img = null; // free up the space since we don't need the image anymore
          scope.$apply(function () {
            item.color = toHex(color);
          });
        });
        scope.$apply(function () {
            items.push(item);
        });
      };

      var handler = buildUploadHandler(previewUploadCallback, resourceProgressCallback);
      fileUploader = initResourceUpload(el, handler);

    }
  }
});

app.controller('imagesSelectController', ['$scope', function($scope) {

}]);
