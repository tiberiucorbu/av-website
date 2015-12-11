(function(window) {
  "use strict";

  var app = window.app;
  app.factory('homePageDataService', ['$http', function($http) {

    return {
      getJson: function() {
        return $http.get('/api/v1/module-config/home-page/');
      },
      postJson: function(data) {
        return $http.post('/api/v1/module-config/home-page/', data);
      }
    };
  }]);

})(window);
