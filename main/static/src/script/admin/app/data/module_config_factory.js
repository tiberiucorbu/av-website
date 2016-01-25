(function(window) {
  "use strict";

  var app = window.app;
  app.factory('moduleConfigFactory', ['$http', function($http) {

    return {
      getJson: function(moduleConfig) {
        return $http.get('/api/v1/module-config/'+moduleConfig+'/');
      },
      postJson: function(moduleConfig, data) {
        return $http.post('/api/v1/module-config/'+moduleConfig+'/', data);
      }
    };
  }]);

})(window);
