(function(window, angular, moment) {
  "use strict";

  var app = window.app;

  app.factory('pagesDataService', function() {
    return {
      getJson: function() {
        return {
          pages: [{
            title: 'Home',
            modelType: 'page',
            url_component: 'home'
          }, {
            title: 'Blog',
            modelType: 'page',
            url_component: 'blog'
          }, {
            title: 'About',
            modelType: 'page',
            url_component: 'about'
          }, {
            title: 'Contact',
            modelType: 'page',
            url_component: 'contact'
          }]
        };
      }
    };
  });



  app.controller('pageListController', ['$scope', 'pagesDataService', function($scope, pagesDataService) {
    $scope.buffer = [];

    $scope.reset = function() {
      $scope.buffer.splice(0, $scope.buffer.length);
    };

    $scope.loadPage = function() {
      var data = pagesDataService.getJson();
      $scope.reset();
      for (var i = 0; i < data.pages.length; i++) {
        data.pages[i].modelType = 'page';
        $scope.buffer.push(data.pages[i]);
      }
    };
    $scope.loadPage();

  }]);
  app.controller('homePageController', ['$scope', 'homePageDataService', 'resourceDataFactory', function($scope, homePageDataService, resourceDataFactory) {
    $scope.page = {

    };

    $scope.pageResourceItems = [];

    homePageDataService.getJson().then(
      function(configRes) {
        var config = JSON.parse(configRes.data.result.config) || {};
        angular.copy(config, $scope.page);
        $scope.pageResourceItems = [];
        if ($scope.page.image_keys) {
          var params = {
            resource_keys: $scope.page.image_keys.join(',')
          };

          resourceDataFactory.getJson(params).then(function(resourceRes) {
            for (var i = 0; i < resourceRes.data.result.length; i++) {
              var resource = resourceRes.data.result[i];
              $scope.pageResourceItems.push(resource);
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
      for (var i = 0; i < $scope.pageResourceItems.length; i++) {
        config.image_keys.push($scope.pageResourceItems[i].key);
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


  app.controller('aboutPageController', ['$scope', 'aboutPageDataService', 'resourceDataFactory',
    function($scope, aboutPageDataService, resourceDataFactory) {
      $scope.page = {

      };

      $scope.pageResourceItems = [];

      aboutPageDataService.getJson().then(
        function(res) {
          var config = JSON.parse(res.data.result.config) || {};
          angular.copy(config, $scope.page);

          $scope.pageResourceItems = [];
          if ($scope.page.image_keys) {
            var params = {
              resource_keys: $scope.page.image_keys.join()
            };

            resourceDataFactory.getJson(params).then(function(resourceRes) {
              for (var i = 0; i < resourceRes.data.result.length; i++) {
                var resource = resourceRes.data.result[i];
                $scope.pageResourceItems.push(resource);
              }
            });
          }


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
          config.image_keys.push($scope.pageResourceItems[i].key);
        }
        var data = {
          module_config: config
        };
        aboutPageDataService.postJson(data).then(function(res) {
          // success ?
        });
      };
    }
  ]);

  app.directive('aboutPageForm', function() {
    return {
      restrict: 'EA',
      templateUrl: '/p/html/admin_app/about_page_form.html'

    };
  });

  app.controller('contactPageController', ['$scope', 'contactPageDataService', 'resourceDataFactory',
    function($scope, conactPageDataService, resourceDataFactory) {
      $scope.page = {

      };

      $scope.pageResourceItems = [];

      conactPageDataService.getJson().then(
        function(res) {
          var config = JSON.parse(res.data.result.config) || {};
          angular.copy(config, $scope.page);

          $scope.pageResourceItems = [];
          if ($scope.page.image_keys) {
            var params = {
              resource_keys: $scope.page.image_keys.join()
            };

            resourceDataFactory.getJson(params).then(function(resourceRes) {
              for (var i = 0; i < resourceRes.data.result.length; i++) {
                var resource = resourceRes.data.result[i];
                $scope.pageResourceItems.push(resource);
              }
            });
          }


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
          config.image_keys.push($scope.pageResourceItems[i].key);
        }
        var data = {
          module_config: config
        };
        conactPageDataService.postJson(data).then(function(res) {
          // success ?
        });
      };
    }
  ]);

  app.directive('contactPageForm', function() {
    return {
      restrict: 'EA',
      templateUrl: '/p/html/admin_app/contact_page_form.html'
    };
  });

})(window, angular, moment);
