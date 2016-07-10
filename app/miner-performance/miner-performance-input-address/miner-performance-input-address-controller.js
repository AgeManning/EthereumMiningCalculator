angular.module('ethMiningCalc')
  .controller('MinerPerformanceInputAddressController', ['$scope', 'MinerPerformanceService', function($scope, minerPerformanceService) {

    var state = {
      value: parseFloat($scope.defaultValue),
      minimised: false,
      loading: false,
      accepted: false
    };

    var acceptValue = function(value) {
      state.minimised = true;
      state.accepted = true;
      state.value = value;
      minerPerformanceService.registerUserInput($scope.componentId, state.value);
    };

    $scope.$on($scope.componentId, function(event, data) {
      if (data.loading) { return state.loading = true; }
      if (data.empty) { return state.loading = false; }
      if (data.autoAccept) { 
        state.accepted = true;
        state.minimised = true;
      }
      if (data.value) {
        state.value = parseFloat(data.value);
        state.loading = false;
        if (data.autoAccept){
          minerPerformanceService.registerUserInput($scope.componentId, state.value);
        }
        return;
      }
    });

    // Expose to $scope
    $scope.state = state;
    $scope.accept = acceptValue;
  }]);
