var app = window.app;

app.directive('imageUploadThumbsPreview', function() {
  return {
    scope: {
      items: '=items'
    },
    replace : true,
    templateUrl: '/p/html/admin_app/image_upload_thumbs_preview.html',
    link: function(scope, el, attr) {
      console.log('imageUploadThumbsPreview', scope);
    }
  }
});

app.directive('imageUploadThumbPreview', function() {
  return {
    scope: {
      item: '=item'
    },
    replace : true,
    templateUrl: '/p/html/admin_app/image_upload_thumb_preview.html',
    link: function(scope, el, attr) {
      console.log('imageUploadThumbnail', scope);
    }
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
    scope: {
      items: '='
    },
    templateUrl: '/resource/upload/?v=only-html',
    link: function(scope, el, attr) {
      console.log('imageUploadForm',scope);

      window.prettyFile();

      var resourceProgressCallback = function(progress, resource, error, file) {
        console.log('resourceUploadedCallback', progress, resource, error, file);
      };

      var previewUploadCallback = function(file) {
          console.log(file);
      };
      
      var handler = buildUploadHandler(previewUploadCallback, resourceProgressCallback);
      fileUploader = initResourceUpload(el, handler);
    }
  }
});

app.controller('imagesSelectController', ['$scope', function($scope) {

}]);
