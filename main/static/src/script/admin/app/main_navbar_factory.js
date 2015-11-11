(function(window) {
  "use strict";

  var app = window.app;
  app.factory('mainNavbarDataService', ['$http', function($http) {

    return {
      getJson: function() {
        return $http.get('/api/v1/module-config/main-navbar/');
      },
      postJson: function(data) {
        return $http.post('/api/v1/module-config/main-navbar/', data);
      }
    };
  }]);

})(window);
