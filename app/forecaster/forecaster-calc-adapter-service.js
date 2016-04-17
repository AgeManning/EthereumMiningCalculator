angular.module('ethMiningCalc')
  .factory('ForecasterCalcAdapterService', ['CalcService', function(CalcService) {
    var factory = {};
    
    factory.calculate = function(fc) {
      console.log(fc);
    }

    return factory;
  }]);