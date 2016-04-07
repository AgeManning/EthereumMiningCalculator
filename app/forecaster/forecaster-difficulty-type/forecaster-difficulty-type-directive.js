angular.module('ethMiningCalc')
  .directive('forecasterDifficultyType', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterDifficultyTypeController',
        templateUrl: 'app/forecaster/forecaster-difficulty-type/forecaster-difficulty-type.html',
        scope: {}
    };
  });