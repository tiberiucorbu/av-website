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

  app.controller ('pageTabsController', ['$scope', function($scope){
    $scope.tabs = {
      activeTab : 'home'
    };
    $scope.setActiveTab = function(tabId){
      $scope.tabs.activeTab = tabId;
    };
    $scope.isActiveTab = function(tabId){
      return $scope.tabs.activeTab === tabId;
    };
  }]);

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

  var pageController = ['$scope', 'moduleConfigFactory', 'resourceDataFactory', function($scope, moduleConfigFactory, resourceDataFactory) {


    $scope.page = {

    };

    $scope.meta = {};

    $scope.pageResourceItems = [];

    moduleConfigFactory.getJson($scope.moduleId).then(
      function(configRes) {
        console.log($scope.moduleId, configRes.data.result.module_id);
        var config = JSON.parse(configRes.data.result.config) || {};
        angular.copy(configRes.data.result, $scope.meta);
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
      var data = {
        module_config: config
      };
      angular.copy($scope.page, config);
      if ($scope.meta) {
        data.meta_keywords = $scope.meta.meta_keywords;
        data.meta_description = $scope.meta.meta_description;
      }
      config.image_keys = [];
      for (var i = 0; i < $scope.pageResourceItems.length; i++) {
        config.image_keys.push($scope.pageResourceItems[i].key);
      }
      console.log($scope.moduleId, data);
      moduleConfigFactory.postJson($scope.moduleId, data).then(function(res) {
        // success ?
      });
    };
  }];

  app.directive('homePageForm', function() {
    return {
      restrict: 'EA',
      controller: pageController,
      templateUrl: '/p/html/admin/home_page_form.html',
      scope : {
        moduleId : '='
      }
    };
  });

  app.directive('aboutPageForm', function() {
    return {
      restrict: 'EA',
      controller: pageController,
      templateUrl: '/p/html/admin/about_page_form.html',
      scope : {
        moduleId : '='
      }

    };
  });

  app.directive('contactPageForm', function() {
    return {
      restrict: 'EA',
      controller: pageController,
      templateUrl: '/p/html/admin/contact_page_form.html',
      scope : {
        moduleId : '='
      }
    };
  });

})(window, angular, moment);
