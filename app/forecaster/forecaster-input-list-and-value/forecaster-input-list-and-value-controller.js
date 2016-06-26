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
      state.value = item.value;
    }
    
    $scope.$on($scope.componentId, function(event, data) {
      if (data.loading) { return state.loading = true; }
      if (data.empty) { return state.loading = false; }
      if (data.autoAccept) { 
        state.accepted = true;
        state.minimised = true;
      }
      if (data.value !== undefined) {
        console.log(parseFloat(data.value));
        state.value = parseFloat(data.value);
        if (data.autoAccept) { 
          forecasterService.registerUserInput($scope.componentId, state.value);
        };
      }
      if (data.list !== undefined) {
        state.list = data.list;
        state.loading = false;
      }
    });

    // Expose to $scope
    $scope.state = state;
    $scope.accept = acceptValue;
    $scope.select = selectListItem;
  }]);
