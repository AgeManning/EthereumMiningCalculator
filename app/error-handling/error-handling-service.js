angular.module('ethMiningCalc')
  .factory('ErrorHandlingService', [function() {
    var factory = {};
   
  // Custom Errors: 
  // PDATAERR : Predicting too far in the past. No blockchain data

  factory.handleError = function(err){
    switch(err){

      case "PDATAERR":
        //TODO: Give a proper UI response
        alert("Can't predict this far into the past. Lower the number of days");
        break;


      default:
        // Some non-custom error
        break;

      };

  };

  return factory;
  }]);
