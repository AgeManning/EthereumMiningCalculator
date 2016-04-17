angular.module('ethMiningCalc')
  .directive('forecasterInputListAndValue', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterInputListAndValueController',
        templateUrl: 'app/forecaster/forecaster-input-list-and-value/forecaster-input-list-and-value.html',
        scope: {
          'componentId': '@',
          'componentName': '@',
          'infoText': '@',
          'defaultValue': '@',
          'listTitle': '@'
        }
    };
  });