angular.module('ethMiningCalc')
  .directive('forecasterInputSingleValue', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterInputSingleValueController',
        templateUrl: 'app/forecaster/forecaster-input-single-value/forecaster-input-single-value.html',
        transclude: true,
        scope: {
          'componentId': '@',
          'componentName': '@',
          'infoText': '@',
          'defaultValue': '@',
          'minValue': '@'
        }
    };
  });
