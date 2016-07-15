angular.module('ethMiningCalc')
  .controller('MinerPerformanceInputAddressController', ['$scope', 'MinerPerformanceService', function($scope, minerPerformanceService) {

    var state = {
      value: $scope.defaultValue,
      minimised: false,
      loading: false,
      accepted: false
    };

    var acceptValue = function(value) {
      value = correctAddress(value);
      if (validateAddress(value)){
        state.minimised = true;
        state.accepted = true;
        state.value = value;
        minerPerformanceService.registerUserInput($scope.componentId, state.value);
      };
    };

    $scope.$on($scope.componentId, function(event, data) {
      if (data.loading) { return state.loading = true; }
      if (data.empty) { return state.loading = false; }
      if (data.autoAccept) { 
        state.accepted = true;
        state.minimised = true;
      }
      if (data.value) {
        if (validateAddress(data.value)){ 
          data.value = correctAddress(data.value);
          state.value = data.value;
          state.loading = false;
          if (data.autoAccept){
            minerPerformanceService.registerUserInput($scope.componentId, state.value);
          }
        };
       return;
      }
    });


    // Validate the mining address
    var validateAddress = function(value) {
      // Check the length and type
      if (value.length == 42 && typeof value === 'string'){
        //check the last 40 characters are hex
        // Use Regex rather than converting to hex numbers, dealing with hectic numbers. 
        var re = /[0-9A-Fa-f]{40}/g;
        var hexString = value.slice(-40);
        if(re.test(hexString)){
          $scope.addressError = false;
          return true;
        };
      };

      $scope.addressError = true;
      return false;
    };

    // Eth hex needs a '0x' prefix
    var correctAddress = function(value){
      //If plain address - add 0x
      if (value.length == 40 && value.charAt(1) != 'x')
        value = '0x' + value;
      return value;
    };

    // Expose to $scope
    $scope.state = state;
    $scope.accept = acceptValue;
  }]);
