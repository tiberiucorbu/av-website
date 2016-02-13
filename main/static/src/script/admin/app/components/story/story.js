(function (window, angular, moment) {
  "use strict";

  var app = window.app;


  app.controller('editStoryController', ['$scope', 'storyItemSelect', '$uibModal', 'storyDataFactory', 'generateDataFactory', function ($scope, storyItemSelect, $uibModal, storyDataFactory, generateDataFactory) {
    $scope.story = storyItemSelect.item;
    // $scope.$watch('story', function(newValue, oldValue) {
    //
    // }, true);
    $scope.requestInProgress = false;
    $scope.save = function () {
      generateDataFactory.getJson().then(function (res) {
        var storyItemKeys = [];
        var items = $scope.story.story_items_expanded;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.key) {
            storyItemKeys.push(item.key);
          }
        }
        var params = angular.extend($scope.story, {
          csrf_token: res.data.result.csrf_token,
          story_items: storyItemKeys
        });
        $scope.requestInProgress = true;
        storyDataFactory.postJson(params).then(function (res) {
          $scope.requestInProgress = false;
          // add here alert
        }, function (res) {
          $scope.requestInProgress = false;
          // add here alert
        });
      });
    };

  }]);

  app.directive('storyItemsEdit', function () {
    return {
      scope: {
        items: '='
      },
      replace: true,
      transclude: true,
      templateUrl: '/p/html/admin/story_items_edit.html',
    };

  });

  app.controller('selectStoryModalInstanceCtrl', ['$scope', '$uibModalInstance', 'items', function ($scope, $uibModalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);

  app.directive('mapDate', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attr, ngModel) {
        ngModel.$formatters.push(function (value) {
          return moment(value).toDate();
        });

        ngModel.$parsers.push(function (value) {
          if ($.trim(value) === '') {
            return null;
          }
          moment(value).toISOString();
        });

      }
    };
  });

  app.directive('storyForm', function () {
    return {
      templateUrl: '/p/html/admin/story_form.html',
      scope: {
        story: '='
      }
    };
  });

  app.factory('storyItemSelect', function () {
    return {};
  });




})(window, angular, moment);
