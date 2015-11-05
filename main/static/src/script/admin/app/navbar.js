var app = window.app;

app.value('navbarTreeModel', [{
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
      postJson: function(data) {
        return $http.post('/api/v1/module-config/main-navbar/', data);
      }
    };
  }]);

app.controller('navbarBuilderController', ['$scope', '$http', 'mainNavbarDataService', 'navbarTreeModel', 'navbarSelectedItem', function($scope, $http, treeModelFactory, navbarTreeModel, navbarSelectedItem) {

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
  };

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

}]);

app.directive('navItemEditForm', function($timeout, navbarSelectedItem) {
  return {
    link: function(scope, elm, attr) {
      var previousValue;
      scope.selectedItem = navbarSelectedItem;
      scope.$watch(function() {
        return scope.selectedItem.item;
      }, function(oldValue, newValue) {
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
        console.log('esc', scope.selectedItem)
        scope.selectedItem.item = {};
      };


    },
    replace: false,
    templateUrl: '/p/html/admin_app/nav_item_edit_form.html'
  };
});
app.directive('navGroup', function() {
  return {
    restrict: "E",
    replace: true,
    scope: {
      nodes: '=nodes'
    },
    templateUrl: '/p/html/admin_app/nav_group.html',
    link: function(scope, element, attrs) {

    }
  }
});

app.directive('navItem', function($compile, navbarSelectedItem) {
  return {
    restrict: 'EA',
    scope: {
      item: '=item',
      onRemove: '&'
    },
    replace: false,
    templateUrl: '/p/html/admin_app/nav_item.html',
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
});
app.directive('navPreview', function($timeout, navbarSelectedItem) {
  return {
    scope: {
      tree: '='
    },
    link: function(scope, elm, attr) {

    },
    templateUrl: '/p/html/admin_app/nav_preview.html'
  };
});

app.controller('storySelectController', function($scope, filterFilter, storyDataFactory) {

  $scope.buffer = []
  var params = storyDataFactory.getDefaultParams();

  var loadPage = function() {
    if (params.loadedAll){
      return;
    }

    storyDataFactory.getJson(params).then(function(res) {
      // Success
      storyDataFactory.updateNextPageParams(params, res);
      var result = res.data.result;
      for (var i=0; i<result.length; i++){
        $scope.buffer.push(result[i]);
      }
      storyDataFactory.updateNextPageParams(params, res);

      console.log(params, $scope.buffer, res);
    }, function(res) {
      // Error
    });
  };

  var reset = function(){
    // clear the buffer
    $scope.buffer = [];
    params = storyDataFactory.getDefaultParams();
  };

  $scope.loadPage = loadPage;

  $scope.typed = function(searchText) {
    reset();
    params.search = searchText;
    loadPage();
  };

  $scope.press = function(item) {
    $scope.selectedItem = item
  };

  // load first page initialy
  loadPage();

});

app.directive('lazyLoad', function() {
  return {
    restrict: 'A',
    link: function(scope, elem) {
      var scroller = elem[0]
      $(scroller).bind('scroll', function() {
        if (scroller.scrollTop + scroller.offsetHeight >= scroller.scrollHeight) {
          scope.$apply('loadPage()')
        }
      })
    }
  }
});

app.directive('listItem', function($compile, navbarSelectedItem) {
  return {
    restrict: 'EA',
    scope: {
      item: '=item',
      onRemove: '&'
    },
    replace: false,
    templateUrl: '/p/html/admin_app/list_item.html' ,
    link: function(scope, element, attrs) {

    }
  };
});
