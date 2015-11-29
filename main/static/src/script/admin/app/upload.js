(function(window) {
  "use strict";

  var app = window.app;

  var toHex = function(color) {
    return '#' + ('00000' + (color.r << 16 | color.g << 8 | color.b).toString(16)).slice(-6);
  };

  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
      type: mime
    });
  }

  app.factory('fileProcessor', ['$log', function($log) {
    return {
      processFile: function(fileItem, callback, scope) {
        $log.debug('processing file', fileItem);
        var file = fileItem.file;
        var result = fileItem;
        if (window.reflectionUtil.toType(file) !== 'file') {
          $log.warn('Can\'t process file:[', file, ']because is not a "File" instance');
        }
        result.file = file;
        $log.debug('Creating file:[', file, '] thumbnail canvas');

        window.imageUtil.loadFileToImageEl(file, function(img) {
          result.file = file;
          var fileName = file.name;
          var thumbailCanvas = window.imageUtil.loadImgToCanvas(img, 128);
          $log.debug('Genarating file:[', fileName, '] thumbnail');
          scope.status = 'Genarating file: ' + fileName + ' thumbnail';
          result.properties.thumbnail = thumbailCanvas.canvas.toDataURL("image/jpeg", 0.8);
          scope.$apply();
          $log.debug('Computing file:[', fileName, '] average color');
          scope.status = 'Computing file: ' + fileName + ' average color';
          result.properties.averageColor = toHex(window.imageUtil.computeAverageRGB(thumbailCanvas.canvas, thumbailCanvas.size));
          scope.$apply();
          $log.debug('Resizing image file:[', fileName, '] to max 1366px');
          scope.status = 'Resizing image file: ' + fileName + ' to max 1366px';
          result.scaledCanvas = window.imageUtil.loadImgToCanvas(img, 1366);

          result.properties.size = {
            w: result.scaledCanvas.size.scaledW,
            h: result.scaledCanvas.size.scaledH
          };
          scope.$apply();
          if (callback) {
            callback(result);
          }
        });
      }
    };

  }]);

  app.directive('fileUpload', ['$log', function($log) {


    return {
      scope: {
        items: '=items',
        multiple: '=multiple',
        acceptTypes : '=acceptTypes'
      },
      templateUrl: '/p/html/admin_app/file_upload.html',
      link: function(scope, el, attr, ctrl) {
        scope.status = '';
        var uploadField = el.find('.upload-input').eq(0);
        uploadField.on('change', function() {
          $log.debug('User selected a number of files', this.files);
          scope.status = 'Beginging processing ' + this.files.length + ' files';
          var buffer = [];
          if (window.reflectionUtil.toType(this.files) === 'filelist') {
            for (var x in this.files) {
              if (this.files.hasOwnProperty(x)) {
                buffer.push({
                  file: this.files[x],
                  properties: {}
                });
              }
            }
          } else if (window.reflectionUtil.toType(this.files) === 'file') {
            buffer.push({
              file: this.files,
              properties: {}
            });
          }
          ctrl.processFiles(buffer);
        });
      },
      controller: ['$scope', 'uploadUrlDataService', 'fileProcessor', function($scope, uploadUrlDataService, fileProcessor) {
        var processFileCallback = function(res) {
          var xhr = new XMLHttpRequest();
          xhr.addEventListener('progress', function(e) {
            $log.debug('Progress', e);
            $scope.status = 'Uploading file in progress ...';
            $scope.$apply();
          });
          xhr.addEventListener('load', function(e) {
            var res = JSON.parse(e.target.response);

            var item = res.result;



            $scope.$apply(function(){
              if ($scope.items){
                $scope.items.push(item);
              }
              $scope.status = '';

            });
          });
          $scope.status = 'Uploading file ' + res.file.name;
          var dataUrl = res.scaledCanvas.canvas.toDataURL("image/jpeg", 0.9);
          var blob = dataURLtoBlob(dataUrl);
          xhr.open('POST', res.upload_url, true);
          var formData = new FormData();
          formData.append("file", blob);
          formData.append('image-thumb-data-url', res.properties.thumbnail);
          formData.append('image-average-color', res.properties.averageColor);
          formData.append('image-size-w', res.properties.size.w);
          formData.append('image-size-h', res.properties.size.h);
          xhr.send(formData);
          $log.debug('Received processed file result', res);
        };

        this.processFiles = function(fileItems) {
          $log.debug('Get url for : ', fileItems.length, ' files');
          var size = fileItems.length;
          uploadUrlDataService.getJson({
            count: size
          }).then(function(res) {
            $log.debug('Successfully got data : ', res);
            for (var x = 0; x < size; x++) {
              fileItems[x].upload_url = res.data.result[x].upload_url;
              fileProcessor.processFile(fileItems[x], processFileCallback, $scope);
            }
          }, function(res) {
            $log.debug('Failed to get data', res);
          });

        };

      }]
    };
  }]);

})(window);
