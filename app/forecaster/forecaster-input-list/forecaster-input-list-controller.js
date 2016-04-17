angular.module('ethMiningCalc')
  .controller('ForecasterInputListController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
    
    var items = forecasterService.getList($scope.componentId);
    
    var state = {
      value: $scope.defaultValue,
      minimised: false,
      loading: false,
      accepted: false,
      itemIsAccepted: function(item) { 
        if(state.value === undefined) { return false; }
        return (item.code === state.value.code);
      }
    };

    var acceptValue = function(value) {
      state.minimised = true;
      state.accepted = true;
      state.value = value.code;
      forecasterService.registerUserInput($scope.componentId, state.value);
    };
    
    var getItemTitle = function(code) {
      return forecasterService.getListItemTitle($scope.componentId, code);
    }
    
    $scope.$on($scope.componentId, function(event, data) {
      if (data.loading) { return state.loading = true; }
      if (data.empty) { return state.loading = false; }
      if (data.autoAccept) { 
        state.accepted = true;
        state.minimised = true;
      }
      if (data.value) {
        state.value = data.value;
      }
      if (data.list) {
        items = data.list;
        state.loading = false;
        return;
      }
    });

    // Expose to $scope
    $scope.items = items;
    $scope.state = state;
    $scope.accept = acceptValue;
    $scope.title = getItemTitle;
  }]);
