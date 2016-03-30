angular.module('ethMiningCalc')
  .factory('GethDataService', ['$http', function($http) {
    var factory = {};

    var gethConfig = {};
    gethConfig.address="http://localhost";
    gethConfig.port="8545";
    gethConfig.url=gethConfig.address + ":" + gethConfig.port;
    /**
     * Check we have a running Geth Node thats up to date
     * 
     * @ Returns boolean
     */
   factory.availableGethNode = function(currentBlockNo) {
     // Generate Allowed Tolerance
     var tolerance = 60; // 30 Block tolerance
     return $http.jsonrpc(gethConfig.url, "eth_blockNumber",[])
      .success(function(result){
        gethBlockNo=  parseInt(result.result,16);
            if( gethBlockNo > currentBlockNo- tolerance){
              return true;
            };
        return false;
      })
      .error(function(){
        return false;
      });
    };





    return factory;
  }]);
