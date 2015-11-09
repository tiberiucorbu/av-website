var app = window.app;

app.directive('imageUploadThumbsPreview', function() {
  return {
    scope: {
      items: '=items'
    },
    templateUrl: '/p/html/admin_app/image_upload_thumbs_preview.html'
  }
});

app.directive('imageUploadThumbnail', function() {
  return {
    scope: {
      item: '=item'
    },
    templateUrl: '/p/html/admin_app/image_upload_thumb_preview.html'
  }
});

app.directive('imageUploadForm', function() {

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
    templateUrl: '/resource/upload/?v=only-html',
    link: function(scope, el, attr) {
      window.prettyFile();

      var resourceUploadedCallback = function(progress, resource, error) {
        console.log(progress, resource, error);
      };

      var previewUploadCallback = function(file) {
        console.log(file);
      }

      var handler = buildUploadHandler(previewUploadCallback, resourceUploadedCallback);

      fileUploader = initResourceUpload(el, {
        preview: function(file) {
          previewUploadCallback(file);
          return resourceUploadedCallback;
        }
      });
    }
  }
});

app.controller('imagesSelectController', ['$scope', function($scope) {

}]);
