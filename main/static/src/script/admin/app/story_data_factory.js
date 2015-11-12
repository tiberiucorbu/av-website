(function(window, angular) {
  "use strict";

  var app = window.app;

  app.factory('storyDataFactory', ['$http', function($http) {
    var url = '/api/v1/story/';
    var defaultParams = {
      limit: 60
    };
    return {
      getJson: function(params) {
        return $http({
          url: url,
          method: "GET",
          params: params || this.getDefaultParams()
        });
      },
      postJson: function(params) {
        return $http.post(url, params);
      },
      getDefaultParams: function() {
        var result = {};
        angular.copy(defaultParams, result);
        return result;
      },
      updateNextPageParams: function(params, res) {
        if (res.data && res.data.next_cursor) {
          params.cursor = res.data.next_cursor;
        }
        if (res.data.result.length < params.limit && !res.data.next_cursor) {
          // if the resulted pagesize is smaller than the assign limit it means
          // that there are no more items
          params.loadedAll = true;
        }
      }
    };
  }]);

  app.factory('storyTreeDataFactory', ['$http', function($http) {
    var url = '/api/v1/story/tree';
    var defaultParams = {
      limit: 60
    };
    return {
      getJson: function(params) {

        return $http({
          url: url,
          method: "GET",
          params:  params || this.getDefaultParams()
        });
      },
      postJson: function(params) {
        return $http.post(url, params);
      },
      getDefaultParams: function() {
        var result = {};
        angular.copy(defaultParams, result);
        return result;
      },
      updateNextPageParams: function(params, res) {
        if (res.data && res.data.next_cursor) {
          params.cursor = res.data.next_cursor;
        }
        if (res.data.result.length < params.limit && !res.data.next_cursor) {
          // if the resulted pagesize is smaller than the assign limit it means
          // that there are no more items
          params.loadedAll = true;
        }
      }
    };
  }]);
})(window, angular);
