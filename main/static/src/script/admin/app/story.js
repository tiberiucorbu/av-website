var app = window.app;

app.controller('storyListController', function($scope, storyDataFactory) {

  $scope.buffer = []
  $scope.selected;
  var params = storyDataFactory.getDefaultParams();

  var loadPage = function() {
    if (params.loadedAll) {
      return;
    }

    storyDataFactory.getJson(params).then(function(res) {
      // Success
      storyDataFactory.updateNextPageParams(params, res);
      var result = res.data.result;
      for (var i = 0; i < result.length; i++) {
        $scope.buffer.push(result[i]);
      }
      storyDataFactory.updateNextPageParams(params, res);

      console.log(params, $scope.buffer, res);
    }, function(res) {
      // Error
    });
  };

  var reset = function() {
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


app.controller('editStoryController', function($scope, $uibModal, storyDataFactory, generateDataFactory) {
  $scope.item = {};

  $scope.openSelectParentStory = function (size) {

    var modalInstance = $uibModal.open({
      templateUrl: '/p/html/admin_app/modal_content.html',
      controller: 'storyListController',
      resolve: {
        title: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.save = function() {
    generateDataFactory.getJson().then(function(res) {
      storyDataFactory.postJson({
        title: $scope.title,
        csrf_token: res.data.result.csrf_token
      }).then(function(res) {

      }, function(res) {

      });
    });
  };

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('selectStoryModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
