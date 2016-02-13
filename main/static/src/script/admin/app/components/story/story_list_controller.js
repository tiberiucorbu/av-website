/**
 * Created by tiberiu on 2/1/16.
 */
(function (window) {
  'use strict';
  var app = window.app;

  app.controller('storyListController', ['$scope', '$log', 'storyDataFactory', 'storyItemSelect', function ($scope, $log, storyDataFactory, storyItemSelect) {

    $scope.buffer = [];
    $scope.selected = null;
    $scope.loading = false;
    var params = storyDataFactory.getDefaultParams();

    var loadPage = function () {
      $scope.loading = true;
      if (params.loadedAll) {
        return;
      }

      storyDataFactory.getJson(params).then(function (res) {
        $scope.loading = false;
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
      }, function (res) {
        $log.debug('Story list controller - failed to load page. Params:', params, ', result:', res);
      });
    };

    var reset = function () {
      // clear the buffer
      $scope.buffer = [];
      params = storyDataFactory.getDefaultParams();
    };

    $scope.deleteStory = function (story) {
      console.log('attemting to delete story', story);
    };

    $scope.newStory = function () {
      var story = {story_items_expanded: []};
      $scope.buffer.unshift(story);
      storyItemSelect.item = story;
      $scope.$broadcast('scrollIntoView', story);
    };

    $scope.reload = function () {
      reset();
      loadPage();
    };
    $scope.loadPage = loadPage;

    // load first page initialy
    loadPage();

  }]);
})(window);
