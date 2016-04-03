angular.module('ethMiningCalc')
  .factory('dataPredictionService', ['EtherchainDataService', "EtherscanDataService", function(EtherchainDataService, EtherscanDataService) {
    var factory = {};

    /*
     * Get the Data required to predict difficulty
     * Will not use Geth otherwise, this app will require a backend.
     *
     * Will draw from two api's etherchain.org and etherscan.io. Hopefully won't burden them too much. 
     * Limit of 20 data points to not flood the API
     * TODO: Make quadratic sampling - recency weight
     * @ Returns a Promise for the data set [blockNos: difficulty] 
     */
    factory.getPredictionData = function(predictData){
      var maxPoints = 20; //Etherscan is using a geth proxy, so its not too bad for 20 data points.
      var ratio = 2; //Ratio of Etherscan to Etherchain api usage. Try 1:1
      // Turns out etherchain won't read more than 1 a min... so lets not use him.

      //Write out the parameters for clarity
      var pastDays = predictData.pastDays;
      var blockTime = predictData.blockTime;
      var curBlockNo = predictData.curBlock;
      var curDifficulty = predictData.curDifficulty;
      var NoPoints = predictData.NoPoints;

      if (NoPoints > maxPoints){
        NoPoints = 20;
      };
      if (NoPoints < 2){
        NoPoints=2;
      }
      return new Promise(function(resolve){
        var pastBlockNo = curBlockNo - Math.round(pastDays*24*3600/blockTime);
        var interval = (curBlockNo - pastBlockNo)/(NoPoints-1);

        var prevPromise = Promise.resolve(); // Looping through promises sequentially
        // Add Today's difficulty, no need to call an API for it. (We already have it :))
        var dataSet = {'0': curDifficulty}; //
        var blockNos =[]; //Store the blocks we wish to evaluate
        var countPromises = 0; // A counter to make sure our promises have all completed.
        // Need to build an array of block numbers to get these promises to work.
        for (var i=0; i < NoPoints-1; i++){
          blockNo = pastBlockNo + Math.round(interval*i); // Note final value will be curBlock,curDifficulty
          blockNos.push(blockNo);
        };
        blockNos.forEach(function(blocks){
           // Split the calls to the api's depending on ratio specified above
           prevPromise = prevPromise.then(function(){
           //Split the load of the api's by the ratio above
           //if (i % (ratio+1) == 0){
           //   return EtherchainDataService.getDifficultyData(blocks);
           //}else{
              return EtherscanDataService.getDifficultyData(blocks);
           //  };
           })
             .then(function(difficulty){
               countPromises += 1;
               // Store the data in terms of Days and not Blocks. Negative as its in the past
               var Days = -(curBlockNo-blocks)*blockTime/3600/24;
               dataSet[Days] = difficulty/(1e12);
               if (countPromises == NoPoints-1){
                 resolve(dataSet);
               };
             })
         });
      }); 
    } 
    return factory;
  }]);
