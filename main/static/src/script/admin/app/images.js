var app = window.app;

app.controller('imagesController',['$scope', function($scope) {
        $scope.onUpload = function(file){
          console.log('on-upload', file);
        };

        $scope.onSuccess = function(file){
          console.log('on-success', file);
        };

        $scope.onComplete = function(res){
          console.log('on-complete', res);
        };

        $scope.onError = function(res){
          console.log('on-error', res);
        };
    }]);
