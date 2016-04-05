angular.module('ethMiningCalc')
  .factory('minerPerformanceService', ['dataPredictionService','PredictionService', "EtherscanDataService","StatisticsService", function(dataPredictionService,PredictionService, EtherscanDataService,statisticsService) {
  var factory = {};

  /*
   * This service retrieves mined blocks. Builds a predictive difficulty over the range
   * of dates the blocks have been mined, then builds a data set to fill a graph showing the performance.
   *
   * @ Returns a Promise for the data set, which feeds to a highcharts service
   */
  factory.checkMinerPerformance = function(inputs){
    var noPoints = 15; // This is number of points to sample difficulty. With our API will take 3 seconds. Hard coded as I don't want to flood the API. I think 15 points is a good enough estimate.
    var dataPoints = 150; // The accuracy of the expectation and variance in the performance plot.
    var address = inputs.performance.address;
    var pastBlocks = inputs.performance.pastBlocks;
    var blockTime = inputs.blockTime;
    var hashRate = inputs.hashRate;

    return new Promise(function(resolve){

      //Find the blocks mined
      EtherscanDataService.getMinedBlocks(address).then(function(blockData){
        if (blockData.length == 0){ //Then no mined blocks under the address
          resolve(undefined); //Send back undefined
          return;
        };
        
        if (pastBlocks == 0 || pastBlocks == undefined){
          pastBlocks = blockData.length;
        };
        // We have blocks - Now we build a data set of the blocks we are interested in
        var dataSet = {};
        dataSet.minedBlocks = [];
        for(var i =0;i < Math.min(pastBlocks,blockData.length);i++){
          //dataSet.minedBlocks.push([new Date(blockData[i].timeStamp*1000),i]);
          // Store just the timestamp
          //Set the first blocks first -- ie count backwards
          var counter =Math.min(pastBlocks,blockData.length-1)-i;
          dataSet.minedBlocks.push([Number(blockData[counter].timeStamp*1000),i]);
        };
        // Sample difficulty over the date range and build a predictive model.
        // Required prediction data
        var predictionData = {};
        //predictionData.pastDays = (dataSet.minedBlocks[0][0].getTime() - dataSet.minedBlocks[dataSet.minedBlocks.length-1][0].getTime())/(1000*3600*24);
        predictionData.pastDays = (dataSet.minedBlocks[dataSet.minedBlocks.length-1][0] - dataSet.minedBlocks[0][0])/(1000*3600*24);
        predictionData.blockTime = blockTime;
        predictionData.curBlock = Number(blockData[0].blockNumber); //Only need difficulty up to last block Mined
        predictionData.NoPoints = noPoints;
        //we need to get the difficulty of the last block. As I've programmed the predictionservice to take this as an input. 
        EtherscanDataService.getDifficultyData(predictionData.curBlock).then(function(curBlockDifficulty){
          predictionData.curDifficulty = curBlockDifficulty/(1e12);
          // Get our sample of points. 
          dataPredictionService.getPredictionData(predictionData).then(function(diffData){
            //Invert this data such that 0 is the past, not today
            var invertedDiffData = InvertPredictionData(diffData);
            //Get an automatic difficulty prediction
            var predictionVariables = PredictionService.predict("automatic",invertedDiffData);
            
            //Now Just build a variance-graph style data-set
            //Build or own function for this as in this case it is looking backwards in time. 
            //Will be very closely modelled after the calc-service.js loop.
            dataSet.expected = BuildVarianceData(predictionVariables,predictionData,dataPoints,dataSet.minedBlocks[0][0],hashRate);

            resolve(dataSet);

            return;
          });
        });
      });
    });
  };
    
  function BuildVarianceData(predictionVariables,predictionData,dataPoints,firstDate,hashRate){
    //Define Needed Variables
    var daysToCalculate = predictionData.pastDays;
    //Set up object for the statistics service. 
    var statsInputs = {}
    statsInputs.blockTime = predictionData.blockTime;
    statsInputs.difficultyType = predictionVariables.type;
    statsInputs.predictionVariables = predictionVariables;
    statsInputs.hashRate = hashRate;

    var data = {};
    data.expected = new Array();
    data.oneSigmaRange = new Array();
    data.twoSigmaLower = new Array();
    data.twoSigmaUpper = new Array();
    data.maximumPlotValue = new Array();
    data.minimumPlotValue = new Array();
    data.maximumValue = statisticsService.expectation(statsInputs, daysToCalculate) + 2 * statisticsService.variance(statsInputs, daysToCalculate); // This stores the maximum plot value. Required to fill the top of the graph with 2 sigma range.
    data.minimumValue =0;

    var linearQuanta = daysToCalculate/dataPoints; //Linear increments
    for(var j=0;j<=dataPoints;j++){
    
      var dependent = j*linearQuanta;
      var expResult = statisticsService.expectation(statsInputs, dependent);
      var varResult = statisticsService.variance(statsInputs, dependent);
      
      // We want to convert the dependent, which is a block-count to a timestamp.
      //Initial timestamp is firstDate
      // var dependentDate = new Date(firstDate.getTime() + dependent*24*3600*1000);
      var dependentDate = firstDate + dependent*24*3600*1000;
      buildDataSetWithVariance(data, dependentDate, expResult, varResult);

    };

    return data;

  };
    


  function InvertPredictionData(predictionData,pastDays){
    //We know the minimum is pastDays - we can't just add this, as there are rounding errors. 
    //So we find the minimum and add that to invert the dataset. 
    
    //Find minimum Value
    var min = 0;
    for(var day in predictionData){
      if (Number(day) < min){
        min = day;
      };
    };
    //Create a new data set that is positive and increasing
    var newData = {'0': predictionData[min]};
    for(var days in predictionData){
      if (days != min){
      newData[Number(days) - min] = predictionData[days]; // min is negative. So this adds
      };
    };
    return newData;
  };

  function buildDataSetWithVariance(data,dependent, expected, std){
    data.expected.push([dependent, expected]);
    // Build Standard Deviation Areas
    data.oneSigmaRange.push([dependent,expected - std, expected + std]);
    data.twoSigmaLower.push([dependent, expected - 2 * std, expected - std]);
    data.twoSigmaUpper.push([dependent, expected + std, expected + 2 * std]);
    data.maximumPlotValue.push([dependent, expected + 2 * std, data.maximumValue * 1.1]);
    data.minimumPlotValue.push([dependent, data.minimumValue, expected - 2 * std]);
  }

    return factory;
  }]);
