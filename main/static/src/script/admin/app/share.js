(function(window, angular, moment) {
  "use strict";

  var app = window.app;

  app.controller('shareController', ['$scope', 'shareDataService', 'resourceDataFactory', function($scope, shareDataService, resourceDataFactory) {
    $scope.share = {

    };

    $scope.resourceItems = [];

    shareDataService.getJson().then(
      function(configRes) {
        var config = JSON.parse(configRes.data.result.config) || {};
        angular.copy(config, $scope.share);
      },
      function(res) {

      }
    );

    $scope.save = function() {
      var config = {};
      angular.copy($scope.share, config);
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
      templateUrl: '/p/html/admin/share_form.html'
    };
  });

})(window, angular, moment);
