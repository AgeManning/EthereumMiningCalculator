angular.module('ethMiningCalc')
  .factory('CalcService', ['ProbabilityChartService', 'VarianceChartService', function(probabilityChartService, varianceChartService) {
    var factory = {};

    factory.calculate = function(inputs, plotOptions) {

        var probability = {};
        probability.network = inputs.hashRate / (inputs.networkHashRate * 1e3); //GH/s	
        probability.difficutly = inputs.hashRate / (inputs.difficulty * 1e6); //TH	
  
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
        data.expectedBlocks.maximumValue = expectation(inputs.blockTime, plotOptions.days, probability.network) + 2 * variance(inputs.blockTime, plotOptions.days, probability.network, inputs.crypto_block); // This stores the maximum plot value. Required to fill the top of the graph with 2 sigma range.
        // Currency Data Set
        data.currencyData ={};
        data.currencyData.expected = new Array();
        data.currencyData.oneSigmaRange = new Array();
        data.currencyData.twoSigmaLower = new Array();
        data.currencyData.twoSigmaUpper = new Array();
        data.currencyData.maximumPlotValue = new Array();
        data.currencyData.minimumPlotValue = new Array();
        data.currencyData.maximumValue = expectation(inputs.blockTime, plotOptions.days, probability.network) + 2 * variance(inputs.blockTime, plotOptions.days, probability.network, inputs.crypto_block)*inputs.currencyRate; 
        

       /** 
        * TODO: Make an option for the user to plot quadratically or linearly.
        */
        var dependents = {};
        dependents.linearQuanta = plotOptions.days/plotOptions.points; //Linear increments
        dependents.quadraticQuanta = Math.sqrt(plotOptions.days)/(plotOptions.points+1); //Quadratic increments
       
        var dependent =0;
        //build the dataset
        for (i = 1; i <= plotOptions.points+1; i++) {

          // Quadratic -- Uncomment for quadratic plotting
          //dependent = Math.pow(i*dependent.quadraticQuanta,2);
          // Linear
          dependent = (i - 1) * dependents.linearQuanta;

          // Only run this once and store as a variable to calculate std fluctuation
          var results = {};
          results.expResult = expectation(inputs.blockTime, dependent, probability.network);
          results.varResult = variance(inputs.blockTime, dependent, probability.network);
          
          buildDataSetWithVariance(data.expectedBlocks, dependent, results.expResult, results.varResult);
          buildDataSetWithVariance(data.currencyData, dependent, results.expResult*inputs.currencyRate, results.varResult*inputs.currencyRate);

          data.probData.push([dependent, probabilityGivenDays(inputs.blockTime, dependent, probability.network)]);

        }

        //Generate Data for tables and fill them
        // Note: We are using the avg network difficulty to calculate table data. This is debatable the most appropriate and accurate measure. Perhaps we shift to difficulty estimates for other currencies.
        results.table = {};
        results.table.eth_hour = expectation(inputs.blockTime, 0.0416667, probability.network) * inputs.crypto_block;
        results.table.eth_day = expectation(inputs.blockTime, 1, probability.network) * inputs.crypto_block;
        results.table.eth_week = expectation(inputs.blockTime, 7, probability.network) * inputs.crypto_block;
        results.table.eth_month = expectation(inputs.blockTime, 30, probability.network) * inputs.crypto_block;

        // Currency Expectations
        results.table.cur_hour = results.table.eth_hour * inputs.currencyRate
        results.table.cur_day = results.table.eth_day * inputs.currencyRate;
        results.table.cur_week = results.table.eth_week * inputs.currencyRate;
        results.table.cur_month = results.table.eth_month * inputs.currencyRate;
        results.table.exp_day = daysGivenBlocks(inputs.blockTime, 1, probability.network);
        results.table.probability_day = probabilityGivenDays(inputs.blockTime,1,probability.network);
        results.table.ci ={};
        results.table.ci.upper = daysGivenProbability(inputs.blockTime, 0.95, probability.network);
        results.table.ci.lower = daysGivenProbability(inputs.blockTime, 0.05, probability.network);
        results.table.check= daysGivenProbability(inputs.blockTime, 0.98, probability.network);
        
        // Generate charting stats
        results.charting = {};
        results.charting.probData = data.probData;
     
        results.charting.expectedBlocks = data.expectedBlocks;
        results.charting.currencyData = data.currencyData;
        return(results);
    }
    
    // Probability of at least one block
		function probabilityGivenDays(blockTime,days,prob_solving_block) {
			//Average number of blocks in "days" 
			var blocks_days = 3600*24*days/blockTime;
			var probability = 1 - Math.pow((1 - prob_solving_block),blocks_days);
			//Turn it into a percent
			return 100*probability;
		}
    //This function will return expected number of days required given a certainty. Eg how many days required to be 95% sure we will solve at least one block
    function daysGivenProbability(blockTime, Probability, prob_solving_block){
      var attempts = Math.log(1-Probability)/Math.log(1-prob_solving_block);
      return attempts*blockTime/3600/24;
    }

    // Expected Days Given Block
    function daysGivenBlocks(blockTime, Blocks, prob_solving_block) {
      var attempts = Blocks/prob_solving_block;
      return attempts*blockTime/3600/24;
    }

		//expected number of blocks solved
		function expectation(blockTime,days,prob_solving_block) {
			//average number of blocks in "days" 
			var blocks_days = 3600*24*days/blockTime;
			var expected = blocks_days*prob_solving_block;
			return expected;
		}

		// STD as a function of days
		function variance(blockTime, days,prob_solving_block) {
			//average number of blocks in "days" 
			var blocks_days = 3600*24*days/blockTime;
			var variance = blocks_days*prob_solving_block*(1- prob_solving_block)
				//Return the standard deviation
			return Math.sqrt(variance);
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
