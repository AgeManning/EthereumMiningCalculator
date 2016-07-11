angular.module('ethMiningCalc')
  .factory('BlockExplorerDataService', ['$http', function($http) {
    var factory = {};

    /**
     * Get all stats for BTC
     * 
     * @returns A promise containing all rates
     */
    factory.getDifficultyBlock = function(block) {
      return $http.get("https://blockexplorer.com/api/block-index/"+block)
        .then(function(result) {
          var hash = result.blockHash;
          $http.get("https://blockexplorer.com/api/block/" + hash)
            .then(function(blockData){
              return Number(blockData.difficulty)*Math.pow(2,32)/1e20; //Multiply to adapt to ETH definition of difficulty. i.e Measure in 1e20 Hash's
            });
        });
    }

    return factory;
  }]);
