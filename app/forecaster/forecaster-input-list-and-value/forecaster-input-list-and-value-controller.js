angular.module('ethMiningCalc')
  .controller('ForecasterInputListAndValueController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
    
    var state = {
      list: [],
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
      state.value = value;
      forecasterService.registerUserInput($scope.componentId, state.value);
    };
    
    var selectListItem = function(item) {
      console.log(item);
      state.value = item.value;
    }
    
    $scope.$on($scope.componentId, function(event, data) {
      if (data.loading) { return state.loading = true; }
      if (data.empty) { return state.loading = false; }
      if (data.value !== undefined) {
        state.list = data.list;
        state.loading = false;
        return;
      }
    });

    // Expose to $scope
    $scope.state = state;
    $scope.accept = acceptValue;
    $scope.select = selectListItem;
  }]);
