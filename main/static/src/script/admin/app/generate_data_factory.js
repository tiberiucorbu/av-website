app.factory('generateDataFactory', function($http) {
  var url = '/api/v1/generate/';
  var defaultParams = {
    token: 'csrf'
  };
  return {
    getJson: function(params) {
      var params = params || this.getDefaultParams();
      return $http({
        url: url,
        method: "GET",
        params: params
      });
    },
    getDefaultParams: function() {
      var result = {};
      angular.copy(defaultParams, result);
      return result;
    }
  }
});
