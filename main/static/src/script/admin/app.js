(function(window, angular) {
  "use strict";
  var app = window.app || angular.module('adminApp', [
    'ng-sortable',
    'hc.marked',
    'ui.bootstrap'
  ]);

  window.app = app;

  app.config(['markedProvider', function(markedProvider) {
    markedProvider.setOptions({
      gfm: true
    });
  }]);

  app.filter('rawHtml', ['$sce', function($sce) {
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  }]);

  app.filter('markdown', ['$sce', 'marked', function($sce, marked) {
    return function(val) {
      var html = marked(val);
      return $sce.trustAsHtml(html);
    };
  }]);
})(window, angular);
