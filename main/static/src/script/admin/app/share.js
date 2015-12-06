(function(window, angular, moment) {
  "use strict";

  var app = window.app;

  app.controller('shareController', ['$scope', 'shareDataService', 'resourceDataFactory', function($scope, shareDataService, resourceDataFactory) {
    $scope.page = {

    };

    $scope.resourceItems = [];

    shareDataService.getJson().then(
      function(configRes) {
        var config = JSON.parse(configRes.data.result.config) || {};
        angular.copy(config, $scope.page);
        $scope.resourceItems = [];
        if ($scope.page.image_keys) {
          var params = {
            resource_keys: $scope.page.image_keys.join(',')
          };

          resourceDataFactory.getJson(params).then(function(resourceRes) {
            for (var i = 0; i < resourceRes.data.result.length; i++) {
              var resource = resourceRes.data.result[i];
              $scope.resourceItems.push(resource);
            }
          });
        }
      },
      function(res) {
  
      }
    );



    $scope.save = function() {
      var config = {};
      angular.copy($scope.page, config);
      config.image_keys = [];
      for (var i = 0; i < $scope.resourceItems.length; i++) {
        config.image_keys.push($scope.resourceItems[i].key);
      }
      var data = {
        module_config: config
      };
      shareDataService.postJson(data).then(function() {
        // success ?
      });
    };
  }]);

  app.directive('shareForm', function() {
    return {
      restrict: 'EA',
      templateUrl: '/p/html/admin_app/share_form.html'
    };
  });

})(window, angular, moment);
