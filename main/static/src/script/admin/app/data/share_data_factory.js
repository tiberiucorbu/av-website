(function(window) {
  "use strict";

  var app = window.app;
  app.factory('shareDataService', ['$http', function($http) {

    return {
      getJson: function() {
        return $http.get('/api/v1/module-config/share-config/');
      },
      postJson: function(data) {
        return $http.post('/api/v1/module-config/share-config/', data);
      }
    };
  }]);

})(window);
