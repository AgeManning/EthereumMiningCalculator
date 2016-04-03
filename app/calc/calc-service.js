angular.module('ethMiningCalc')
  .factory('CalcService', ['StatisticsService', function(statisticsService) {
    var factory = {};

    factory.calculate = function(inputs, plotOptions,predictionData, isPredictive) {

        //Want to define probability per blocks. If we use difficulty, we must multiply by block time to get an estimate for probability per block. The hashrate just gives us the probability per block.
        var probability = {};
        //Network Difficulty for Network Difficulty Graphs
        probability.network = inputs.hashRate / (inputs.networkHashRate * 1e3); //GH/s	
        probability.difficulty = inputs.hashRate /(inputs.difficulty * 1e6)*inputs.blockTime; //TH	
  
        //Set up the arrays
        var data = {};
        data.probData = new Array();
        // Expected Block Data Set
        data.expectedBlocks ={};
        data.expectedBlocks.expected = new Array();
        data.expectedBlocks.oneSigmaRange = new Array();
        data.expectedBlocks.twoSigmaLower = new Array();
        data.expectedBlocks.twoSigmaUpper = new Array();
        data.expectedBlocks.maximumPlotValue = new Array();
        data.expectedBlocks.minimumPlotValue = new Array();
        data.expectedBlocks.maximumValue = statisticsService.expectation(inputs, plotOptions.days) + 2 * statisticsService.variance(inputs, plotOptions.days); // This stores the maximum plot value. Required to fill the top of the graph with 2 sigma range.
        // Currency Data Set
        data.currencyData ={};
        data.currencyData.expected = new Array();
        data.currencyData.oneSigmaRange = new Array();
        data.currencyData.twoSigmaLower = new Array();
        data.currencyData.twoSigmaUpper = new Array();
        data.currencyData.maximumPlotValue = new Array();
        data.currencyData.minimumPlotValue = new Array();
        data.currencyData.maximumValue = (statisticsService.expectation(inputs, plotOptions.days) + 2 * statisticsService.variance(inputs, plotOptions.days))*inputs.currencyRate; 
       // Predictive Data
       if (isPredictive){
          data.predictionData = [];
         // Set up the forms for each prediction type
         switch(inputs.difficultyType){
           case("linear"):
             var predictedDifficulty = function(day){
               return inputs.predictionVariables.a*day + inputs.predictionVariables.b;
             };
             break;
           case("quadratic"):
             var predictedDifficulty = function(day){
               return inputs.predictionVariables.a*Math.pow(day,2) + inputs.predictionVariables.b*day + inputs.predictionVariables.c;
             };
             break;
           case("exponential"):
             var predictedDifficulty = function(day){
               return inputs.predictionVariables.a*Math.exp(inputs.predictionVariables.b*day);
             };
             break;
         };

         // Still have to fill past data, the following for loop only fills future data
         // Also build a chart compatible array from predictionData
         data.actualDiffData = [];
         for(var day in predictionData){
           //Need to order the 0 at the end for highcharts.
           if (Number(day) != 0){
             data.actualDiffData.push([Number(day), predictionData[day]]);
             data.predictionData.push([Number(day), predictedDifficulty(Number(day))]);
           };
         };
         //Add today's data at end of the array.
         data.actualDiffData.push([0, predictionData["0"]]);
         data.predictionData.push([0, predictedDifficulty(0)]);
       };


       /** 
        * TODO: Make an option for the user to plot quadratically or linearly.
        */
        var dependents = {};
        dependents.linearQuanta = plotOptions.days/plotOptions.points; //Linear increments
        dependents.quadraticQuanta = Math.sqrt(plotOptions.days)/(plotOptions.points+1); //Quadratic increments
       
        var dependent =0;
        //build the dataset
        for (var i = 1; i <= plotOptions.points+1; i++) {

          // Quadratic -- Uncomment for quadratic plotting
          //dependent = Math.pow(i*dependent.quadraticQuanta,2);
          // Linear
          dependent = (i - 1) * dependents.linearQuanta;
        
          // Set up predictive Data -- Specifically the probability with given difficulty
          if (isPredictive && i != 1){
            data.predictionData.push([dependent, predictedDifficulty(dependent)]);
          };
          
          // Only run this once and store as a variable to calculate std fluctuation
          var results = {};
          results.expResult = statisticsService.expectation(inputs, dependent);
          results.varResult = statisticsService.variance(inputs, dependent);
          buildDataSetWithVariance(data.expectedBlocks, dependent, results.expResult, results.varResult);
          buildDataSetWithVariance(data.currencyData, dependent, results.expResult*inputs.currencyRate, results.varResult*inputs.currencyRate);

          data.probData.push([dependent, statisticsService.probabilityAtLeastOneBlock(inputs, dependent)]);

        }

        //Generate Data for tables and fill them
        // Note: We are using the avg network difficulty to calculate table data. This is debatable the most appropriate and accurate measure. Perhaps we shift to difficulty estimates for other currencies.
        results.table = {};
        results.table.eth_hour = statisticsService.expectation(inputs, 0.0416667)*inputs.crypto_Block;
        results.table.eth_day = statisticsService.expectation(inputs, 1) * inputs.crypto_Block;
        results.table.eth_week = statisticsService.expectation(inputs ,7) * inputs.crypto_Block;
        results.table.eth_month = statisticsService.expectation(inputs, 30) * inputs.crypto_Block;

        // Currency Expectations
        results.table.cur_hour = results.table.eth_hour * inputs.currencyRate
        results.table.cur_day = results.table.eth_day * inputs.currencyRate;
        results.table.cur_week = results.table.eth_week * inputs.currencyRate;
        results.table.cur_month = results.table.eth_month * inputs.currencyRate;

        // Second Table -- Doesn't make sense with predictive data.
        if(!isPredictive){
          results.table.exp_day = statisticsService.daysGivenBlocks(inputs.blockTime, 1, probability.difficulty);
          results.table.probability_day = statisticsService.probabilityAtLeastOneBlock(inputs,1);
          results.table.ci ={};
          results.table.ci.upper = statisticsService.daysGivenProbability(inputs.blockTime, 0.95, probability.difficulty);
          results.table.ci.lower = statisticsService.daysGivenProbability(inputs.blockTime, 0.05, probability.difficulty);
          results.table.check= statisticsService.daysGivenProbability(inputs.blockTime, 0.98, probability.difficulty);
        } 
        // Generate charting stats
        results.charting = {};
        results.charting.probData = data.probData;
        results.charting.expectedBlocks = data.expectedBlocks;
        results.charting.currencyData = data.currencyData;
        if (isPredictive){
          results.charting.predictiveDifficulty ={};
          results.charting.predictiveDifficulty.actualDiffData = data.actualDiffData;
          results.charting.predictiveDifficulty.predictedDiffData = data.predictionData;
        }
        return(results);
    }
    
    	
    /**
     *  Build Data Sets with Variance
     * 
     * 
     */
    function buildDataSetWithVariance(data,dependent, expected, std){
      data.expected.push([dependent, expected]);
      // Build Standard Deviation Areas
      data.oneSigmaRange.push([dependent, Math.max(0, expected - std), expected + std]);
      data.twoSigmaLower.push([dependent, Math.max(0, expected - 2 * std), Math.max(expected - std)]);
      data.twoSigmaUpper.push([dependent, expected + std, expected + 2 * std]);
      data.maximumPlotValue.push([dependent, expected + 2 * std, data.maximumValue * 1.1]);
      data.minimumPlotValue.push([dependent, 0, Math.max(0, expected - 2 * std)]);
    }



    return factory;
  }]);
