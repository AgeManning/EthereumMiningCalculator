angular.module('ethMiningCalc')
  .factory('BlockchainDataService', ['$http', function($http) {
    var factory = {};

    /**
     * Get all stats for BTC
     * 
     * @returns A promise containing all rates
     */
    factory.getBlockTime = function() {
      return $http.get("https://blockchain.info/q/interval")
        .then(function(result) {
          return result.data;
        });
    }

     factory.getDifficulty = function() {
      return $http.get("https://blockchain.info/q/getdifficulty")
        .then(function(result) {
          return result.data;
          });
     }

     factory.getCurrentBlock = function() {
      return $http.get("https://blockchain.info/q/getblockcount")
        .then(function(result) {
          return result.data;
          });
     }

     factory.getBlockReward = function() {
      return $http.get("https://blockchain.info/q/bcperblock")
        .then(function(result) {
          return result.data;
          });
     }

    return factory;
  }]);
