/**
 * Created by tiberiu on 2/1/16.
 */
(function (window) {
  'use strict';
  var app = window.app;
  app.directive('canonicalPath', function () {

    return {
      scope: {
        textInput: '='
      },
      restrict: 'A',

      link: function (scope, el) {

        scope.$watch('textInput.$viewValue', function (v) {
          var text = window.strings.removeDiacritics(v);
          text = window.strings.improveTextForPath(text);
          // a hack read below
          angular.element(el).val(text).trigger('input');
          //scope.$apply();
          // For some reason I didn't manage to make this work so I used the input
          // element as a hack, perhaps I missused it
          // ngModelCtrl.$setViewValue(text);
          // ngModelCtrl.$commitViewValue();

        });

      }

    };

  });

})(window);
