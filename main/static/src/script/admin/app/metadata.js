(function(window) {
  "use strict";
  var metadataForm = function() {

    return {
      scope: {
        item: '=item',
      },
      replace: true,
      controller : ['$scope', 'resourceDataFactory',function($scope, resourceDataFactory){
        this.save = function(){
          resourceDataFactory.postJson($scope.item).then(function(res){

          });
        };
      }],
      controllerAs: 'ctrl',
      templateUrl: '/p/html/admin/metadata_form.html'

    };
  };

  app.directive('metadataForm', metadataForm);
})(window);
