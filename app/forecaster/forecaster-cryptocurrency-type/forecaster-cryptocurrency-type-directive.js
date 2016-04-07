angular.module('ethMiningCalc')
  .directive('forecasterCryptocurrencyType', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterCryptocurrencyTypeController',
        templateUrl: 'app/forecaster/forecaster-cryptocurrency-type/forecaster-cryptocurrency-type.html',
        scope: {}
    };
  });