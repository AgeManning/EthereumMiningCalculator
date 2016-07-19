angular.module('ethMiningCalc')
  .directive('forecasterInputCurrency', function() {
    return {
        restrict: 'AE',
        controller: 'forecasterInputCurrencyController',
        templateUrl: 'app/forecaster/forecaster-input-currency/forecaster-input-currency.html',
        scope: {
          'componentId': '@',
          'componentName': '@',
          'infoText': '@',
          'defaultValue': '@',
        }
    };
  });
