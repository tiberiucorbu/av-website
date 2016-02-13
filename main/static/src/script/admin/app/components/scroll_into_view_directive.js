/**
 * Created by tiberiu on 2/1/16.
 */
(function (window) {
  'use strict';
  var app = window.app;

  app.directive('scrollIntoView', function () {
    return {
      link: function (scope) {
        scope.$on('scrollIntoView', function (data) {
          //console.log('scroll into view', data);
        });
      }
    };
  });

})(window);
