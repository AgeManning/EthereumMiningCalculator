angular.module('ethMiningCalc')
  .controller('ForecasterInputSingleValueController', ['$scope', 'ForecasterService', function($scope, forecasterService) {

    //Display an error if 0 is entered
    var isZero = false;

    var state = {
      value: parseFloat($scope.defaultValue),
      minimised: false,
      loading: false,
      accepted: false
    };

    var acceptValue = function(value) {
      if (validateZeros(value))
        isZero = true;
      if($scope.inputForm.$invalid || validateZeros(value)) {
      return;
      }
      state.minimised = true;
      state.accepted = true;
      state.value = value;
      forecasterService.registerUserInput($scope.componentId, state.value);
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
        if (validateZeros(data.value))
          isZero = true; //Display error
        if($scope.inputForm.$invalid || validateZeros(data.value)) {

          return;
        }
        state.loading = false;
        if (data.autoAccept){
          forecasterService.registerUserInput($scope.componentId, state.value);
        }
        return;
      }
    });

    // Expose to $scope
    $scope.state = state;
    $scope.accept = acceptValue;
    $scope.isZero = isZero;

    // Some components are allowed 0's others are not
    // Returns true if invalid
    var validateZeros = function(value) {
      var allowedZeros = ['initialInvestment', 'electricityUsage', 'electricityRate'];
      if (allowedZeros.indexOf($scope.componentId) <= -1) { //Not the allowed zero's
        if (value == 0)
          return true;
      }
      return false;
    };




  }]);
