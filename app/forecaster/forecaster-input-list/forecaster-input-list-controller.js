angular.module('ethMiningCalc')
  .controller('ForecasterInputListController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
    
    var items = forecasterService.getStaticList($scope.componentId);
    
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
      state.value = value;
      forecasterService.registerUserInput($scope.componentId, state.value.code);
    };

    // Expose to $scope
    $scope.items = items;
    $scope.state = state;
    $scope.accept = acceptValue;
  }]);
