angular.module('ethMiningCalc')
  .directive('forecasterBlockTime', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterBlockTimeController',
        templateUrl: 'app/forecaster/forecaster-block-time/forecaster-block-time.html',
        scope: {}
    };
  });