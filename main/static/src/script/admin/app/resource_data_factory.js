(function(window) {
  "use strict";

  var app = window.app;
  app.factory('resourceDataFactory', ['$http', function($http) {

    return {
      getJson: function(params) {
        return $http({
          url: '/api/v1/resource/',
          params: params
        });
      },
      deleteJson: function(params) {
        return $http({
          method: 'DELETE',
          url: '/api/v1/resource/',
          params: params
        });
      }
    };
  }]);

})(window);
