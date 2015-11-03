  angular.module('navbarBuilderApp', ['ng-sortable'])
    .constant('ngSortableConfig', {
        onEnd: function() {

        }
    })

    .value('navbarTreeModel', [{nodes: [], label: 'Main Navbar'}])
    .factory('modelFactory', ['$http', function ($http) {
      return {
          getJson: function () {
            return $http.get('/api/v1/module-config/main-navbar/');
          }
        };
    }])
    .controller('NavbarBuilderController', ['$scope', '$http', 'modelFactory', 'navbarTreeModel', function ($scope, $http, modelFactory, navbarTreeModel) {

      $scope.tree = navbarTreeModel;

      modelFactory.getJson().then(
        function (res) {
          var config = JSON.parse(res.data.result.config) || [];
          angular.copy([{nodes: config, label: 'Main Navbar'}], navbarTreeModel);
        },
        function() {

        }
      );

      var mapRecoursive = function(model, copyObject){
        copyObject.label = model.label;
        if (model.nodes !== null && $.isArray(model.nodes)){
          copyObject.nodes = [];
          for (var i=0; i< model.nodes.length; i++){
            var node = {id: model.nodes[i].id};
            copyObject.nodes.push(node);
            mapRecoursive(model.nodes[i], copyObject.nodes[i]);
          }
        }
      }

      var composeNavbarObj = function(model) {
        var copyObject = [];
        for (var i = 0; i<model.length; i++){
          copyObject[i] = {};
          mapRecoursive(model[i], copyObject[i]);
        }
        return copyObject;
      };

      var successCallback = function(res){
        console.log(res);
        //$scope.navbarTree = JSON.parse(response.data.result.config);
      };

      var errorCallback = function(res){
        console.log(res);

      };

      $scope.save = function () {
        var copy = composeNavbarObj(navbarTreeModel[0].nodes);
        // post copy
        var data = {'module_config': copy};
        var config = {};
        $http.post('/api/v1/module-config/main-navbar/', data, config).then(successCallback, errorCallback);
      };


      $scope.delete = function(data) {
          data.nodes = [];
      };
      $scope.add = function(data) {
          var post = data.nodes.length + 1;
          var newName = data.name + '-' + post;
          data.nodes.push({name: newName, nodes: []});
      };
    }])

    .directive('navItemEditForm', function($timeout) {
    return {
      scope: {
        item: '=item',
        handleSave: '&onSave',
        handleCancel: '&onCancel'
      },
      link: function(scope, elm, attr) {
        var previousValue;

        scope.edit = function() {
          scope.editMode = true;
          previousValue = scope.model;

          $timeout(function() {
            elm.find('input')[0].focus();
          }, 0, false);
        };
        scope.save = function() {
          scope.editMode = false;
          scope.handleSave({value: scope.model});
        };
        scope.cancel = function() {
          scope.editMode = false;
          scope.model = previousValue;
          scope.handleCancel({value: scope.model});
        };
      },
      template: `
      <div>
        <input type="text" on-enter="save()" on-esc="cancel()" ng-model="item" ng-show="editMode">
        <button ng-click="cancel()" ng-show="editMode">cancel</button>
        <button ng-click="save()" ng-show="editMode">save</button>
        <span ng-mouseenter="showEdit = true" ng-mouseleave="showEdit = false">
          <span ng-hide="editMode" ng-click="edit()">{{model}}</span>
          <a ng-show="showEdit" ng-click="edit()">edit</a>
        </span>
      </div>
      `
      };
    })
    .directive('navGroup', function () {
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
        link: function (scope, element, attrs) {

        }
    	}
    })

    .directive('navItem', function($compile) {


    return {
      restrict : 'EA',
      scope : {
        item : '=item',
        onRemove : '&'
      },
      replace: false,
      template: `
          <span class="drag-handle" style="cursor: grab">☰</span>
          {{item.label}}
          <button ng-click="onRemove()">Remove</button>
          <button ng-click="onNewChildNode(item, $event)">Add Child</button>
        `,
        link: function (scope, element, attrs) {

          scope.onNewChildNode = function(item, $event){
            if (!angular.isArray(item.nodes)){
              item.nodes = [];
            }
            if (element[0].querySelectorAll('.group').length === 0 ){
              var newGroupEl = angular.element("<nav-group nodes='item.nodes'/>");
              element.append(newGroupEl);
      				$compile(newGroupEl)(scope);
            }
            item.nodes.push({label : 'new item'});
            return false;
          };
    			if (angular.isArray(scope.item.nodes) && scope.item.nodes.length > 0 ) {
    				var newGroupEl = angular.element("<nav-group nodes='item.nodes'/>");
            element.append(newGroupEl);
    				$compile(newGroupEl)(scope)
    			}
    		}
    };
  });
