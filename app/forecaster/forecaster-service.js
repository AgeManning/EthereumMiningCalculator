angular.module('ethMiningCalc')
  .factory('ForecasterService', ['$rootScope', 'MarketDataService', function($rootScope, marketDataService) {
    var factory = {};
    
    var loadMarketData = function(cryptoCurrencyCode, currencyCode){
      return new Promise(function(resolve){
      marketDataService.get(cryptoCurrencyCode,currencyCode)
        .then(function(marketData) {
          $scope.$apply(function() {
            inputs.networkHashRate = marketData.networkHashRate;
            inputs.difficulty = marketData.difficulty;
            inputs.blockTime = marketData.blockTime;
            currentBlock = marketData.currentBlock;
            currencies.usd.cryptoRate = Math.round(marketData.usd_crypto*100)/100; // I spose we only care about 2dp
            currencies.aud.cryptoRate = Math.round(marketData.aud_crypto*100)/100;
            setCurrencyCode(currencyCode); //Default to AUD
            });
          });
      resolve();
      });
    };
    
    
    userInputs = {};
    
    factory.registerUserInput = function(type, value) {
      userInputs[type] = value;
      $rootScope.$broadcast('userInputs-updated')
    }
    
    factory.getUserInputs = function() {
      return userInputs;
    }
    
    return factory;
  }]);