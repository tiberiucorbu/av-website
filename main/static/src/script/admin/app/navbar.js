(function(window, angular) {
  "use strict";


  var app = window.app;

  app.value('navbarTreeModel', [{
      nodes: [],
      label: 'Main Navbar',
      modelType: 'rootNode',
      deepness: 0
    }])
    .factory('navbarSelectedItem', function() {
      return {};
    });

  var navbarBuilderController = function($scope, $http, treeModelFactory, navbarTreeModel, navbarSelectedItem) {

    $scope.tree = navbarTreeModel;
    $scope.selectedItem = navbarSelectedItem;



    var reload = function() {
      $scope.status = 'Loading';

      treeModelFactory.getJson().then(
        function(res) {
          var config = JSON.parse(res.data.result.config) || [];
          angular.copy([{
            nodes: config,
            label: 'Main Navbar'
          }], navbarTreeModel);
          $scope.status = 'Loaded';
        },
        function(res) {
          $scope.error = res;
          $scope.status = 'Faild to load';
        }
      );
    };

    var mapRecoursive = function(model, copyObject) {
      copyObject.label = model.label;
      for ( var x in model ){
          if (model.hasOwnProperty(x) && x.match(/^[a-z]/) && x !== 'nodes'){
            copyObject[x] = model[x];
          }
      }
      if (model.nodes !== null && $.isArray(model.nodes)) {
        copyObject.nodes = [];
        for (var i = 0; i < model.nodes.length; i++) {
          var node = {
            id: model.nodes[i].id
          };
          copyObject.nodes.push(node);
          mapRecoursive(model.nodes[i], copyObject.nodes[i]);
        }
      }
    };

    var composeNavbarObj = function(model) {
      var copyObject = [];
      for (var i = 0; i < model.length; i++) {
        copyObject[i] = {};
        mapRecoursive(model[i], copyObject[i]);
      }
      return copyObject;
    };

    $scope.save = function() {
      $scope.status = 'Saving ... ';
      var copy = composeNavbarObj(navbarTreeModel[0].nodes);
      // post copy
      var data = {
        'module_config': copy
      };

      treeModelFactory.postJson(data).then(function(res) {
        console.log(res);
        $scope.status = 'Saved !';
        //$scope.navbarTree = JSON.parse(response.data.result.config);
      }, function(res) {
        console.log(res);

      });
    };


    $scope.delete = function(data) {
      data.nodes = [];
    };
    $scope.add = function(data) {
      var post = data.nodes.length + 1;
      var newName = data.name + '-' + post;
      var item = {
        name: newName,
        nodes: []
      };
      data.nodes.push(item);
      navbarSelectedItem.item = item;
    };
    reload();
  };

  app.controller('navbarBuilderController', ['$scope', '$http', 'mainNavbarDataService', 'navbarTreeModel', 'navbarSelectedItem', navbarBuilderController]);

  var navbarItemEditFormDirective = function($timeout, navbarSelectedItem) {
    return {
      link: function(scope, elm, attr) {
        scope.selectedItem = navbarSelectedItem;
        scope.$watch(function() {
          return scope.selectedItem.item;
        }, function( /* oldValue, newValue */ ) {
          scope.focusAndSelectFirst();
        });
        scope.focusAndSelectFirst = function() {
          $timeout(function() {
            var input = elm.find('input')[0];
            input.focus();
            if (input.select) {
              input.select();
            } else if (input.setSelectionRange) {
              input.setSelectionRange(0, input.value.lenght);
            }
          }, 0, false);
        };

        scope.cancel = function() {
          //console.log('esc', scope.selectedItem)
          scope.selectedItem.item = {};
        };


      },
      replace: false,
      templateUrl: '/p/html/admin_app/nav_item_edit_form.html'
    };
  };

  app.directive('navItemEditForm', ['$timeout', 'navbarSelectedItem', navbarItemEditFormDirective]);

  var navBarItemFromStory = function(story) {
    return {
      label: story.title,
      key: story.key,
      modelType: story.modelType,
      url_component: story.canonical_path
    };
  };

  var navBarItemFromPage = function(page) {
    console.log(page);
    return {

      label: page.title,
      modelType: page.modelType,
      url_component: page.url_component
    };
  };

  var navBarItemFromTag = function(tag) {
    return {
      label: tag.label,
      modelType: tag.modelType,
      url_component: tag.url_component
    };
  };

  var convertNavbarItem = function(item, items, newIndex) {
    var navbarItem = item;
    if (item.modelType === 'story') {
      navbarItem = navBarItemFromStory(item);
    } else if (item.modelType === 'page') {
      navbarItem = navBarItemFromPage(item);
    } else if (item.modelType === 'tag') {
      navbarItem = navBarItemFromTag(item);
    }
    console.log(navbarItem);
    if (navbarItem !== item) {
      items[newIndex] = navbarItem;
      return true;
    } else {
      return false;
    }
  };

  var navGroupDirective = function() {
    return {
      restrict: "E",
      replace: true,
      scope: {
        nodes: '=nodes'
      },
      templateUrl: '/p/html/admin_app/nav_group.html',
      link: function(scope, element, attrs) {
        scope.sortableConfig = {
          group: 'navbar',
          animation: 150,
          onAdd: function(evt) {
            var item = evt.model;
            var items = evt.models;
            var newIndex = evt.newIndex;

            var modified = convertNavbarItem(item, items, newIndex);
            if (scope.$parent.item){
              var deepness = scope.$parent.item.deppness;
              item.deepness = deepness + 1;
            }
          }
        };
      }
    };
  };

  app.directive('navGroup', navGroupDirective);

  var navItemDirective = function($compile, navbarSelectedItem) {
    return {
      restrict: 'EA',
      scope: {
        item: '=item',
        onRemove: '&'
      },
      replace: false,
      templateUrl: '/p/html/admin_app/nav_item.html',
      link: function(scope, element) {
        scope.onSelect = function(item) {
          var resource = navbarSelectedItem;
          resource.item = item;
        };
        scope.isSelected = function() {
          return scope.item === navbarSelectedItem.item;

        };
        scope.onNewChildNode = function(item) {
          if (!angular.isArray(item.nodes)) {
            item.nodes = [];
          }
          if (element[0].querySelectorAll('.group').length === 0) {
            var newGroupEl = angular.element("<nav-group nodes='item.nodes'/>");
            element.append(newGroupEl);
            $compile(newGroupEl)(scope);
          }
          item.nodes.push({
            label: 'new item',
            modelType: 'custom',
            deepness : item.deepness+1
          });
          return false;
        };
        if (angular.isArray(scope.item.nodes) && scope.item.nodes.length > 0) {
          var newGroupEl = angular.element("<nav-group nodes='item.nodes'/>");
          element.append(newGroupEl);
          $compile(newGroupEl)(scope);
        }
      }
    };
  };

  app.directive('navItem', ['$compile', 'navbarSelectedItem', navItemDirective]);
  var navPreviewDirective = function() {
    return {
      scope: {
        tree: '='
      },
      // link: function(scope, elm, attr) {
      //
      // },
      templateUrl: '/p/html/admin_app/nav_preview.html'
    };
  };
  app.directive('navPreview', navPreviewDirective);

  var lazyLoadDirective = function() {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        var scroller = elem[0];
        $(scroller).bind('scroll', function() {
          if (scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight) {
            scope.$apply('loadPage()');
          }
        });
      }
    };
  };

  app.directive('lazyLoad', lazyLoadDirective);

  var listItemDirective = function() {
    return {
      restrict: 'EA',
      scope: {
        item: '=item',
        onRemove: '&'
      },
      replace: false,
      templateUrl: '/p/html/admin_app/list_item.html'
    };
  };

  app.directive('listItem', listItemDirective);

})(window, angular);
