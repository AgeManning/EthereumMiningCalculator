angular.module('ethMiningCalc')
  .factory('ErrorHandlingService', [function() {
    var factory = {};
   
  /* Custom Errors: 
   *    PDATAERR  : Predicting too far in the past. No blockchain data
   *    ETHBT     : ETH BlockTime source fail
   *    ETHCB     : ETH Current block source fail
   *    ETHDIFF   : ETH Difficulty source fail
   *    BTCBT     : BTC BlockTime source fail
   *    BTCCB     : BTC Current block source fail
   *    BTCDIFF   : BTC Difficulty source fail
   *    BTCBR     : BTC Block Reward Source fail
   */   
   

  factory.handleError = function(err){
    switch(err){

      case "PDATAERR":
        //TODO: Give a proper UI response
        alert("Can't predict this far into the past. Lower the number of days");
        break;

      case "ETHCB":
        alert("Can't get current block. Fail");
        break;

      case "ETHDIFF":
        alert("Can't get difficulty. Fail");
        break;

      case "ETHBT":
        alert("Can't get block time. Fail");
        break;

      case "BTCCB":
        alert("Can't get current block (BTC). Fail ");
        break;

      case "BTCDIFF":
        alert("Can't get difficulty (BTC). Fail");
        break;

      case "BTCBT":
        alert("Can't get block time (BTC). Fail");
        break;

      case "BTCBR":
        alert("Can't get block reward (BTC). Fail");
        break;

      default:
        console.log(err);
        // Some non-custom error
        break;

      };

  };

  return factory;
  }]);
