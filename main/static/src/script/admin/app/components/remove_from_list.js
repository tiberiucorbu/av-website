(function(window) {
  "use strict";

  var app = window.app;

  var removeFromListDirective = function(){

    return {
      restrict : 'A',
      scope: {
        items: '=items'
      },
      controller :['$scope', function($scope){
        this.stuff = 'hello';
        this.removeItem = function(item){
          for (var x = 0; x< $scope.items.lenght; x++){
            var idx = -1;
            if (item === $scope.items[x]){
                  idx = x;
                  break;
            }
          }
          if (idx > -1){
              $scope.items.splice(idx, 1);
          }
        };
      }],
      controllerAs: 'rflCtrl',
      link : function(scope){

      }
    }
  };

  app.directive('removeFromList', removeFromListDirective);

})(window);
