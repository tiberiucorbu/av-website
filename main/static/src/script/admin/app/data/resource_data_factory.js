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
      },
      postJson: function(post) {
        if (post) {
          console.log(post);
          var params = {
            name: post.name,
            description: post.description,
            tags: post.tags,
            image_average_color : post.image_average_color,
            csrf_token : post.csrf_token,
            key : post.key
          };
          return $http.post('/api/v1/resource/', params);
        }
      }
    };
  }]);

})(window);
