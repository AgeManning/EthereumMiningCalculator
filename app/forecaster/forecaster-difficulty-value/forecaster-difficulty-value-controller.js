angular.module('ethMiningCalc')
  .controller('ForecasterDifficultyValueController', ['$scope', 'ForecasterService', function($scope, forecasterService) {

    var componentId = 'difficultyValue';

    var state = {
      value: undefined,
      minimised: false,
      loading: false,
      accepted: false
    };

    var acceptValue = function(value) {
      state.minimised = true;
      state.accepted = true;
      state.value = value;
      forecasterService.registerUserInput(componentId, value);
    };

    $scope.$on(componentId, function(event, data) {
      if (data.loading) { return state.loading = true; }
      if (data.empty) { return state.loading = false; }
      if (data.value) {
        state.value = data.value;
        state.loading = false;
        return;
      }
    });

    // Configure scope
    $scope.state = state;
    $scope.accept = acceptValue;
  }]);
