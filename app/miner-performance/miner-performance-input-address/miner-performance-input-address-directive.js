angular.module('ethMiningCalc')
  .directive('minerPerformanceInputAddress', function() {
    return {
        restrict: 'AE',
        controller: 'MinerPerformanceInputAddressController',
        templateUrl: 'app/miner-performance/miner-performance-input-address/miner-performance-input-address.html',
        scope: {
          'componentId': '@',
          'componentName': '@',
          'infoText': '@',
          'defaultValue': '@'
        }
    };
  });
