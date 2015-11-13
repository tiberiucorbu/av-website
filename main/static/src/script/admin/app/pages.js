(function(window, angular, moment) {
  "use strict";

  var app = window.app;

  app.controller('homePageController', ['$scope', 'homePageDataService', function($scope, homePageDataService) {
    $scope.page = {

    };

    $scope.pageResourceItems = [];

    homePageDataService.getJson().then(
      function(res) {
        var config = JSON.parse(res.data.result.config) || {};
        angular.copy(config, $scope.page);
      },
      function(res) {
        // Request failed
      }
    );
    $scope.save = function() {
      var config = {};
      angular.copy($scope.page, config);
      config.image_keys = [];
      for (var i = 0; i < $scope.pageResourceItems.length; i++) {
        config.image_keys.push($scope.pageResourceItems[i].resource.key);
      }
      var data = {
        module_config: config
      };
      homePageDataService.postJson(data).then(function(res) {
        // success ?
      });
    };
  }]);

  app.directive('homePageForm', function() {
    return {
      restrict: 'EA',
      templateUrl: '/p/html/admin_app/home_page_form.html'

    };
  });


  app.controller('aboutPageController',  ['$scope', 'aboutPageDataService', function($scope, aboutPageDataService) {
    $scope.page = {

    };

    $scope.pageResourceItems = [];

    aboutPageDataService.getJson().then(
      function(res) {
        var config = JSON.parse(res.data.result.config) || {};
        angular.copy(config, $scope.page);
      },
      function(res) {
        // Request failed
      }
    );
    $scope.save = function() {
      var config = {};
      angular.copy($scope.page, config);
      config.image_keys = [];
      for (var i = 0; i < $scope.pageResourceItems.length; i++) {
        config.image_keys.push($scope.pageResourceItems[i].resource.key);
      }
      var data = {
        module_config: config
      };
      aboutPageDataService.postJson(data).then(function(res) {
        // success ?
      });
    };
  }]);

  app.directive('aboutPageForm', function() {
    return {
      restrict: 'EA',
      templateUrl: '/p/html/admin_app/about_page_form.html'

    };
  });

})(window, angular, moment);
