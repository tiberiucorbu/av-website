  angular.module('navbarBuilderApp', ['ng-sortable'])
    .constant('ngSortableConfig', {
      onEnd: function() {

      }
    })

  .value('navbarTreeModel', [{
      nodes: [],
      label: 'Main Navbar'
    }])
    .factory('navbarSelectedItem', function() {
      return {};
    })
    .factory('mainNavbarDataService', ['$http', function($http) {
      return {
        getJson: function() {
          return $http.get('/api/v1/module-config/main-navbar/');
        },
        postJson : function(data){
          return $http.post('/api/v1/module-config/main-navbar/', data);
        }
      };
    }])
    .controller('NavbarBuilderController', ['$scope', '$http', 'mainNavbarDataService', 'navbarTreeModel', 'navbarSelectedItem', function($scope, $http, treeModelFactory, navbarTreeModel, navbarSelectedItem) {

      $scope.tree = navbarTreeModel;
      $scope.selectedItem = navbarSelectedItem;

      treeModelFactory.getJson().then(
        function(res) {
          var config = JSON.parse(res.data.result.config) || [];
          angular.copy([{
            nodes: config,
            label: 'Main Navbar'
          }], navbarTreeModel);
        },
        function() {

        }
      );

      var mapRecoursive = function(model, copyObject) {
        copyObject.label = model.label;
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
      }

      var composeNavbarObj = function(model) {
        var copyObject = [];
        for (var i = 0; i < model.length; i++) {
          copyObject[i] = {};
          mapRecoursive(model[i], copyObject[i]);
        }
        return copyObject;
      };

      var successCallback = function(res) {
        console.log(res);
        //$scope.navbarTree = JSON.parse(response.data.result.config);
      };

      var errorCallback = function(res) {
        console.log(res);

      };

      $scope.save = function() {
        var copy = composeNavbarObj(navbarTreeModel[0].nodes);
        // post copy
        var data = {
          'module_config': copy
        };

        treeModelFactory.postJson(data).then(successCallback, errorCallback);
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

    }])

  .directive('navItemEditForm', function($timeout, navbarSelectedItem) {
      return {
        link: function(scope, elm, attr) {
          var previousValue;
          scope.selectedItem = navbarSelectedItem;
          scope.$watch(function(){
            return scope.selectedItem.item;
          }, function(oldValue, newValue){
            scope.focusAndSelectFirst();
          });
          scope.focusAndSelectFirst = function() {
            $timeout(function() {
              var input = elm.find('input')[0];
              input.focus();
              if (input.select){
                input.select();
              } else if (input.setSelectionRange) {
                input.setSelectionRange(0, input.value.lenght);
              }
            }, 0, false);
          };

          scope.cancel = function() {
            console.log('esc', scope.selectedItem)
            scope.selectedItem.item = {};
          };


        },
        template: `
      <div ng-show="selectedItem.item">
        <div class="form-group">
          <label>Label</label>
          <input type="text" ui-keydown="{esc: 'cancel($event)'}" ng-model="selectedItem.item.label">
        </div>
        <div class="form-group">
          <label>link</label>
          <input type="text" ui-keydown="{esc: 'cancel($event)'}" ng-model="selectedItem.item.href">
        </div>
        <!--  Or select a default page -->
        <hr />
        <div story-selector></div>
      </div>
      `
      };
    })
    .directive('navGroup', function() {
      return {
        restrict: "E",
        replace: true,
        scope: {
          nodes: '=nodes'
        },
        template: `
        <div class="group" >
          <ul ng-sortable="{ group: 'todo', animation: 150 }" style="min-height: 30px">
            <li nav-item item="node" index="$index" ng-repeat="node in nodes" on-remove="nodes.splice($index,1)" />
          </ul>
        </div>
        `,
        link: function(scope, element, attrs) {

        }
      }
    })

  .directive('navItem', function($compile, navbarSelectedItem) {
    return {
      restrict: 'EA',
      scope: {
        item: '=item',
        onRemove: '&'
      },
      replace: false,
      template: `
          <div ng-class="{'selected': isSelected(item)}">
            <span class="drag-handle" style="cursor: grab">☰</span>
            <span ng-click="onSelect(item)" class="Label">{{item.label}}</span>
            <div>
              <button class="remove" ng-click="onRemove()">Remove</button>
              <button class="addChild" ng-click="onNewChildNode(item, $event)">Add Child</button>
            </div>
          </div>
        `,
      link: function(scope, element, attrs) {
        scope.onSelect = function(item) {

          var resource = navbarSelectedItem;
          resource.item = item;
          console.log('From navitem : ', navbarSelectedItem);
        };
        scope.isSelected = function() {
          return scope.item === navbarSelectedItem.item;

        };
        scope.onNewChildNode = function(item, $event) {
          if (!angular.isArray(item.nodes)) {
            item.nodes = [];
          }
          if (element[0].querySelectorAll('.group').length === 0) {
            var newGroupEl = angular.element("<nav-group nodes='item.nodes'/>");
            element.append(newGroupEl);
            $compile(newGroupEl)(scope);
          }
          item.nodes.push({
            label: 'new item'
          });
          return false;
        };
        if (angular.isArray(scope.item.nodes) && scope.item.nodes.length > 0) {
          var newGroupEl = angular.element("<nav-group nodes='item.nodes'/>");
          element.append(newGroupEl);
          $compile(newGroupEl)(scope)
        }
      }
    };
  }).directive('navPreview', function($timeout, navbarSelectedItem) {
    return {
      scope: {
        tree : '='
      },
      link: function(scope, elm, attr) {

      },
      template: `
      <div>
        I am legion
      </div>
      `
    };
  });


app.factory('StoryDataFactory', function() {
  return {
    getData: function() {
      var letters = []
      for (var i = 1; i < 2001; i++) {
        letters.push({
          name: 'Item' +  i.toString()
        })
      }
      return letters
    }
  }
})

app.controller('StorySelectController', function($scope, filterFilter, StoryDataFactory) {

  var data = DataFactory.getData()

  var ind = 0


  $scope.buffer = angular.copy(data)
  $scope.cachedLetters = data.slice(0, 10)

 $scope.typed = function(searchText){
   $scope.buffer = filterFilter(data, searchText)
 }

 $scope.$watch('buffer', function(){
   console.log('data changed')
   ind = 0
   $scope.cachedLetters = $scope.buffer.slice(0, 10)
 })

  $scope.resetList = function() {
    ind = 0
    $scope.cachedLetters = $scope.letters.slice(0, 10)

  }

  $scope.loadMore = function() {
    ind = ind + 10
    var r = 10
    if (ind + 10 >= $scope.buffer.length) {
      r = $scope.buffer.length - ind
    }
    console.log("Loading")
    $scope.cachedLetters = $scope.cachedLetters.concat($scope.buffer.slice(ind, r + ind))
  }

  $scope.press = function(item) {
    $scope.selectedItem = item
    console.log(item.name)

  }

})

app.directive('lazyLoad', function() {
  return {
    restrict: 'A',
    link: function(scope, elem) {
      var scroller = elem[0]
      $(scroller).bind('scroll', function() {
        if (scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight) {
          scope.$apply('loadMore()')
        }
      })
    }
  }
})
