(function (window, angular) {
  "use strict";

  var app = window.app;

  app.directive('storyListItem', ['$compile', 'storyItemSelect', function ($compile, storyItemSelect) {
    return {
      restrict: 'EA',
      scope: {
        story: '=',
        onSelect: '&',
        editOnSelect: '='
      },
      replace: true,
      controllerAs: 'controller',
      controller: ['$scope', 'storyDataFactory', function ($scope, dataFactory) {
        this.deleteStory = function () {
          dataFactory.deleteJson({story_keys: [$scope.story.key]}).then(function (res) {
            $scope.story.deleted = true;
          }, function (res) {
            flash.msg('Unable to delete story');
          });
        };

        this.restoreStory = function () {
          dataFactory.deleteJson({story_keys: [$scope.story.key], restore: true})
            .then(function (res) {
              $scope.story.deleted = false;
            }, function (res) {
              flash.msg('Unable to delete story');
            });
        };
      }],
      templateUrl: '/p/html/admin/story_list_item.html',
      link: function (scope) {
        var linkedOnSelect = scope.onSelect;
        scope.selectedItem = storyItemSelect;
        scope.onSelect = function () {
          if (scope.isSelected()) {
            storyItemSelect.item = null;
          } else {
            storyItemSelect.item = scope.story;
          }
          if (linkedOnSelect) {
            linkedOnSelect();
          }
        };
        scope.isDeleted = function () {
          return scope.story.deleted;
        };

        scope.isSelected = function () {
          return storyItemSelect.item === scope.story;
        };

        scope.showEditForm = function () {
          return (scope.editOnSelect || false) && scope.isSelected();
        };
      }
    };
  }]);
})(window, angular);
