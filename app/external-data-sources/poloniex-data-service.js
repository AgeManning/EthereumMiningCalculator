angular.module('ethMiningCalc')
  .factory('PoloniexDataService', ['$http', function($http) {
    var factory = {};

    /**
     * Get the ticker
     * 
     * @returns A promise containing all ticker data
     */
    factory.getTicker = function() {
      return $http.get("https://poloniex.com/public?command=returnTicker")
        .then(function(result) {
          return result.data;
        });
    }

    return factory;
  }]);