angular.module('ethMiningCalc')
  .factory('CalcService', ['ProbabilityChartService', 'VarianceChartService', function(probabilityChartService, varianceChartService) {
    var factory = {};

    factory.calculate = function(inputs, plotOptions) {
      //Get Data from forms. But use the global variables which contain better accuracy.
        var hashrate = inputs.hashRate;
        var daysToCompute = plotOptions.days;
        var DataPoints = plotOptions.points + 1; //So that it lands nicely on integer days
        var blockTime = inputs.blockTime;
        var currencyEthRate = inputs.currencyRate;
        var prob_solving_block_network = hashrate / (inputs.networkHashRate * 1e3); //GH/s	
        var prob_solving_block_difficulty = hashrate / (inputs.difficulty * 1e6); //TH	
        //Set up the arrays
        var probData = new Array();
        var expData = new Array();
        var varData = new Array();
        var currencyData = new Array();

        //Variance Data
        var stdData = new Array();
        var std2LowerData = new Array();
        var std2UpperData = new Array();
        var maximumPlotValue = new Array();
        var lowerPlotValue = new Array();
        // Set number of data points. I'm using a quadratic to sample more points earlier on
        //Increment to satisfy number of days
        //Quadratic Plotting in Graphs
        //var x = Math.sqrt(daysToCompute)/DataPoints;
        // Linear Plotting in Graphs
        var x = daysToCompute / (DataPoints - 1);
        //var currencyConversion = document.forms["Calculator"]["exchange"].value; 

        //Dependent variable for clarity;
        var dependent = 0;

        // Find Maximum Expectation Value and Variance to Fill Sdd Graph
        // Will Fill the rest of this graph representing beyond 2 sigma
        var maximumVal = expectation(blockTime, daysToCompute, prob_solving_block_network) + 2 * variance(blockTime, daysToCompute, prob_solving_block_network);

        //build a dataset
        for (i = 1; i <= DataPoints; i++) {
          // I'm using a quadratic to get more data points earlier than later, so total is Number of Days
          // Quadratic
          //dependent = Math.pow(i*x,2);
          // Linear
          dependent = (i - 1) * x;

          // Only run this once and store as a variable to calculate std fluctuation
          var expResult = expectation(blockTime, dependent, prob_solving_block_network);
          var varResult = variance(blockTime, dependent, prob_solving_block_network);

          probData.push([dependent, probability(blockTime, dependent, prob_solving_block_network)]);
          expData.push([dependent, expResult]);
          varData.push([dependent, varResult]);



          //STD Plot Stuff
          stdData.push([dependent, Math.max(0, expResult - varResult), expResult + varResult]);
          std2LowerData.push([dependent, Math.max(0, expResult - 2 * varResult), Math.max(expResult - varResult)]);
          std2UpperData.push([dependent, expResult + varResult, expResult + 2 * varResult]);

          maximumPlotValue.push([dependent, expResult + 2 * varResult, maximumVal * 1.1]);
          lowerPlotValue.push([dependent, 0, Math.max(0, expResult - 2 * varResult)]);

        }

        //Generate Data for tables and fill them
        var eth_block = 5;
        var results = {};
        results.table = {};
        results.table.eth_hour = expectation(blockTime, 0.0416667, prob_solving_block_network) * eth_block;
        results.table.eth_day = expectation(blockTime, 1, prob_solving_block_network) * eth_block;
        results.table.eth_week = expectation(blockTime, 7, prob_solving_block_network) * eth_block;
        results.table.eth_month = expectation(blockTime, 30, prob_solving_block_network) * eth_block;

        // Currency Expectations
        results.table.cur_hour = results.table.eth_hour * currencyEthRate;
        results.table.cur_day = results.table.eth_day * currencyEthRate;
        results.table.cur_week = results.table.eth_week * currencyEthRate;
        results.table.cur_month = results.table.eth_month * currencyEthRate;
        results.table.p95_days = daysGivenProbability(blockTime, 0.95, prob_solving_block_network);
        results.table.exp_day = daysGivenBlocks(blockTime, 1, prob_solving_block_network);

        // Generate charting stats
        results.charting = {};
        results.charting.probData = probData;
     
        results.charting.expData = expData;
        results.charting.stdData = stdData;
        results.charting.std2UpperData = std2UpperData;
        results.charting.std2LowerData = std2LowerData;
        results.charting.maximumPlotValue = maximumPlotValue;
        results.charting.lowerPlotValue = lowerPlotValue;
        
        return(results);
    }
    
    // Probability of at least one block
		function probability(blockTime,days,prob_solving_block) {
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
	
		/*
    function GenerateStdGraph(upperexpData,expData,lowerexpData){
			$.jqplot('StdGraph',[upperexpData,expData,lowerexpData],{
				title: "Expectation with 1 standard deviation limits",
				axes:{yaxis:{min:0, label:"Blocks"},
					xaxis:{min:0,label:"Days"}},
					series:[{color:'green'},{color:"#4bb2c5"},{color:'green'}]
			}).replot();

		}

		function GenerateCurrencyGraph(varData){
			var yaxis = "";
			
			if (document.getElementById("AUD").checked){
				yaxis = "AUD";}
			else {
				yaxis = "USD";}
			
			$.jqplot('CurrencyGraph',[varData],{
				title: "Expected " + yaxis ,
				axes:{yaxis:{min:0, label:yaxis + "($)"},
					xaxis:{min:0,label:"Days"}}}).replot();
		}
    */
			
		

    return factory;
  }]);