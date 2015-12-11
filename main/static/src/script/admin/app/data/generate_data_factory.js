(function(window, angular) {

  "use strict";

  var app = window.app;

  app.factory('generateDataFactory', ['$http', function($http) {
    var url = '/api/v1/generate/';
    var defaultParams = {
      token: 'csrf'
    };
    return {
      getJson: function(params) {
        return $http({
          url: url,
          method: "GET",
          params: params || this.getDefaultParams()
        });
      },
      getDefaultParams: function() {
        var result = {};
        angular.copy(defaultParams, result);
        return result;
      }
    };
  }]);
})(window, angular);
