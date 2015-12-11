(function(window) {
  "use strict";

  var app = window.app;
  app.factory('aboutPageDataService', ['$http', function($http) {

    return {
      getJson: function() {
        return $http.get('/api/v1/module-config/about-page/');
      },
      postJson: function(data) {
        return $http.post('/api/v1/module-config/about-page/', data);
      }
    };
  }]);

})(window);
