(function(window) {
  "use strict";

  var app = window.app;
  app.factory('contactPageDataService', ['$http', function($http) {

    return {
      getJson: function() {
        return $http.get('/api/v1/module-config/contact-page/');
      },
      postJson: function(data) {
        return $http.post('/api/v1/module-config/contact-page/', data);
      }
    };
  }]);

})(window);
