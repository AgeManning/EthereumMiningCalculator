angular.module('ethMiningCalc')
  .controller('forecasterInputCurrencyController', ['$scope', 'ForecasterService', function($scope, forecasterService) {

    var currencyCodeComponentId = $scope.componentId + 'Code';

    var state = {
      list: [],
      valueTitle: '',
      value: $scope.defaultValue,
      minimised: false,
      loading: false,
      accepted: false,
      itemIsAccepted: function(item) {
        if(state.value === undefined) { return false; }
        return (item.code === state.value.code);
      }
    };

    var acceptValue = function(value, valueTitle) {
      if($scope.inputForm.$invalid || value == 0) {
        return;
      }
      state.minimised = true;
      state.accepted = true;
      state.value = value;
      forecasterService.registerUserInput($scope.componentId, state.value);
      forecasterService.registerUserInput(currencyCodeComponentId, state.valueTitle);
    };

    var selectListItem = function(item) {
      state.value = item.value;
      state.valueTitle = item.code;
    }

    $scope.$on($scope.componentId, function(event, data) {
      if (data.loading) { return state.loading = true; }
      if (data.empty) { return state.loading = false; }
      if (data.autoAccept) {
        state.accepted = true;
        state.minimised = true;
      }
      state.value = parseFloat(data.value);
      if (data.autoAccept) {
        forecasterService.registerUserInput($scope.componentId, state.value);
      };

      if (data.list !== undefined) {
        state.list = data.list;
        state.loading = false;
      }
    });

    $scope.$on(currencyCodeComponentId, function(event, data) {
      state.valueTitle = data.value;
      if (data.autoAccept) {
        forecasterService.registerUserInput(currencyCodeComponentId, state.valueTitle);
      };
    });

    // Expose to $scope
    $scope.state = state;
    $scope.accept = acceptValue;
    $scope.select = selectListItem;
  }]);
