angular.module('ethMiningCalc')
  .controller('ForecasterInputSingleValueController', ['$scope', 'ForecasterService', function($scope, forecasterService) {

    var state = {
      value: parseInt($scope.defaultValue),
      minimised: false,
      loading: false,
      accepted: false
    };

    var acceptValue = function(value) {
      state.minimised = true;
      state.accepted = true;
      state.value = value;
      forecasterService.registerUserInput($scope.componentId, state.value);
    };

    $scope.$on($scope.componentId, function(event, data) {
      if (data.loading) { return state.loading = true; }
      if (data.empty) { return state.loading = false; }
      if (data.value) {
        state.value = data.value;
        state.loading = false;
        return;
      }
    });

    // Expose to $scope
    $scope.state = state;
    $scope.accept = acceptValue;
  }]);
