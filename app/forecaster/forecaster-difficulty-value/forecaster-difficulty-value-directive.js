angular.module('ethMiningCalc')
  .directive('forecasterDifficultyValue', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterDifficultyValueController',
        templateUrl: 'app/forecaster/forecaster-difficulty-value/forecaster-difficulty-value.html',
        scope: {}
    };
  });