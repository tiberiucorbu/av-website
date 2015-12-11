(function(window) {
  "use strict";

  var url = '/api/v1/resource/upload/';

  var app = window.app;
  app.factory('uploadUrlDataService', ['$http', function($http) {

    return {
      getJson: function(params) {
        return $http({
          url: url,
          method: "GET",
          params: params
        });
      },
      postJson: function(data) {
        return $http.post(url, data);
      }
    };
  }]);

})(window);
