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

     factory.getDifficultyData = function(blockNo) {
      return $http.get("https://www.etherchain.org/api/block/" + blockNo)
        .then(function(result) {
          console.log(result.data);
          return result.data.data[0].difficulty;
          });
     }


    return factory;
  }]);
