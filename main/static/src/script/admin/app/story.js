(function(window, angular, moment) {
  "use strict";

  var app = window.app;



  app.controller('storyListController', ['$scope','$log', 'storyDataFactory', 'storyItemSelect', function($scope, $log, storyDataFactory, storyItemSelect) {

    $scope.buffer = [];
    $scope.selected = null;
    var params = storyDataFactory.getDefaultParams();

    var loadPage = function() {
      if (params.loadedAll) {
        return;
      }

      storyDataFactory.getJson(params).then(function(res) {
        $log.debug('Story list controller - successfully loaded page params:', params, ', result:', res);
        // Success
        storyDataFactory.updateNextPageParams(params, res);
        var result = res.data.result;
        for (var i = 0; i < result.length; i++) {
          result[i].modelType = 'story';
          $scope.buffer.push(result[i]);
        }
        storyDataFactory.updateNextPageParams(params, res);

        $log.debug(params, $scope.buffer, res);
      }, function(res) {
        $log.debug('Story list controller - failed to load page. Params:', params, ', result:', res);
      });
    };

    var reset = function() {
      // clear the buffer
      $scope.buffer = [];
      params = storyDataFactory.getDefaultParams();
    };

    $scope.newStory = function() {
      var story = {};
      $scope.buffer.unshift(story);
      storyItemSelect.item = story;
      $scope.$broadcast('scrollIntoView', story);
    };

    $scope.reload = function() {
      reset();
      loadPage();
    };
    $scope.loadPage = loadPage;

    // load first page initialy
    loadPage();

  }]);



  app.controller('editStoryController', ['$scope', 'storyItemSelect', '$uibModal', 'storyDataFactory', 'generateDataFactory', function($scope, storyItemSelect, $uibModal, storyDataFactory, generateDataFactory) {
    $scope.story = storyItemSelect.item;
    // $scope.$watch('story', function(newValue, oldValue) {
    //
    // }, true);
    $scope.save = function() {
      generateDataFactory.getJson().then(function(res) {
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
        storyDataFactory.postJson(params).then(function(res) {
          console.log(res);
        }, function(res) {
          console.log(res);
        });
      });
    };

  }]);

  app.directive('storyItemsEdit', function(){
    return {
      scope: {
        items : '='
      },
      replace : true,
      transclude: true,
      templateUrl: '/p/html/admin_app/story_items_edit.html',
    };

  })

  app.directive('canonicalPath', function() {

    return {
      scope: {
        textInput: '='
      },
      restrict: 'A',

      link: function(scope, el, attr) {

        scope.$watch('textInput.$viewValue', function(v) {
          var text = window.strings.removeDiacritics(v);
          text = window.strings.improveTextForPath(text);
          // a hack read below
          angular.element(el).val(text).trigger('input');
          //scope.$apply();
          // For some reason I didn't manage to make this work so I used the input
          // element as a hack, perhaps I missued it
          // ngModelCtrl.$setViewValue(text);
          // ngModelCtrl.$commitViewValue();

        });

      }

    };

  });

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $uibModal service used above.



  app.controller('selectStoryModalInstanceCtrl', ['$scope', '$uibModalInstance', 'items', function($scope, $uibModalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function() {
      $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  }]);

  app.directive('mapDate', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attr, ngModel) {
        ngModel.$formatters.push(function(value) {
          return moment(value).toDate();
        });

        ngModel.$parsers.push(function(value) {
          if ($.trim(value) === '') {
            return null;
          }
          moment(value).toISOString();
        });

      }
    };
  });

  app.directive('storyForm', function() {
    return {
      templateUrl: '/p/html/admin_app/story_form.html',
      scope: {
        story: '='
      }
    };
  });

  app.factory('storyItemSelect', function() {
    return {};
  });

  app.directive('storyListItem', ['$compile', 'storyItemSelect', function($compile, storyItemSelect) {
    return {
      restrict: 'EA',
      scope: {
        story: '=',
        onSelect: '&',
        editOnSelect: '='
      },
      replace: true,
      templateUrl: '/p/html/admin_app/story_list_item.html',
      link: function(scope, el, attrs) {
        var linkedOnSelect = scope.onSelect;
        scope.selectedItem = storyItemSelect;
        scope.onSelect = function() {
          if (scope.isSelected()) {
            storyItemSelect.item = null;
          } else {
            storyItemSelect.item = scope.story;
          }
          if (linkedOnSelect) {
            linkedOnSelect();
          }
        };

        scope.isSelected = function() {
          return storyItemSelect.item === scope.story;
        };

        scope.showEditForm = function() {
          return (scope.editOnSelect || false) && scope.isSelected();
        };
      }
    };
  }]);


  app.directive('scrollIntoView', function() {
    return {
      link: function(scope) {
        scope.$on('scrollIntoView', function(data) {
          console.log(data);
        });
      }
    }

  });

})(window, angular, moment);
