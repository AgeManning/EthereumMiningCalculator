angular.module('ethMiningCalc')
  .directive('forecasterInputList', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterInputListController',
        templateUrl: 'app/forecaster/forecaster-input-list/forecaster-input-list.html',
        scope: {
          'componentId': '@',
          'componentName': '@',
          'infoText': '@',
          'defaultValue': '@'
        }
    };
  });