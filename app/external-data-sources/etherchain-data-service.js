angular.module('ethMiningCalc')
  .factory('EtherchainDataService', ['$http', function($http) {
    var factory = {};

    /**
     * Get all stats
     * 
     * @returns A promise containing all rates
     */
    factory.getBasicStats = function() {
      return $http.get("https://www.etherchain.org/api/basic_stats")
        .then(function(result) {
          return result.data.data;
        });
    }


    factory.getBlockDifficultyData = function(prevDays,blockTime,NoPoints) {
      
       






      };





    return factory;
  }]);
