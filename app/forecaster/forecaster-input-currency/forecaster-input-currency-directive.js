angular.module('ethMiningCalc')
  .directive('forecasterInputCurrency', function() {
    return {
        restrict: 'AE',
        controller: 'forecasterInputCurrencyController',
        templateUrl: 'app/forecaster/forecaster-input-currency/forecaster-input-currency.html',
        transclude: true,
        scope: {
          'componentId': '@',
          'componentName': '@',
          'infoText': '@',
          'defaultValue': '@',
        }
    };
  });
