angular.module('ethMiningCalc')
  .factory('EtherscanDataService', ['$http', function($http) {
    var factory = {};

    /**
     * Get all stats
     * 
     * @returns A promise containing all rates
     */
     factory.getDifficultyData = function(blockNo) {
      hexBlockNo = "0x" + blockNo.toString(16);
      return $http.get("http://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=" + hexBlockNo + "&boolean=true")
        .then(function(result) {
          return parseInt(result.data.result.difficulty,16);
          });
     }

     factory.getMinedBlocks = function(address){
      return $http.get("http://api.etherscan.io/api?module=account&action=getminedblocks&address=" + address + "&blocktype=blocks")
        .then(function(result) {
          return result.data.result;
          });
     };

    return factory;
  }]);
