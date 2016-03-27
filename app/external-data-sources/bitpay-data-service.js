angular.module('ethMiningCalc')
  .factory('BitpayDataService', ['$http', function($http) {
    var factory = {};

    /**
     * Get all rates
     * 
     * @returns A promise containing an array of rates
     */
    factory.getRates = function() {
      return $http.get("https://bitpay.com/api/Rates")
        .then(function(result) {
          return result.data;
        });
    }

    /**
     * Find a rate for a specific code from a set of results
     * 
     * @param {array} rates A set of rates (probably from this.getRates)
     * @param {string} code Currency code (eg, AUD)
     * @returns Promise containing the rate (or undefined)
     */
    factory.findRate = function(rates, code) {
      var found = _.find(rates, function(rate) {
        return rate.code === code;
      });
      return found;
    }

    return factory;
  }]);