$(document).ready(function(){
		
		});

		$.getJSON("https://www.etherchain.org/api/basic_stats", function(json) {
			//Find Difficulty and average time
		window.difficulty = json.data.stats.difficulty/1e12;
		window.blockTime = json.data.stats.blockTime;
		window.hashRate = json.data.stats.hashRate/1e9;
		$('input[name="networkhashrate"]').val(window.hashRate);	
		$('input[name="difficulty"]').val(window.difficulty);	
		$('input[name="blocktime"]').val(window.blockTime);	

		}
		);

		$.getJSON("https://poloniex.com/public?command=returnTicker",function(json) {
			//Find Ethereum Exchange Rates
		window.eth_btc = json.BTC_ETH.last;
		window.btc_usd = json.USDT_BTC.last;
		window.eth_usd = json.USDT_ETH.last;
		}
		);

		$.getJSON("http://api.fixer.io/latest?base=AUD",function(json) {
			//Find Difficulty and average time
		window.aud_usd = json.rates.USD;
		window.eth_aud=window.eth_btc*window.btc_usd/window.aud_usd
		$('input[name="exchange"]').val(window.eth_aud)
		}
		);


		function drawplots() {
		$.jqplot('chart1', [[3,5,8,3,5,2,12,5]]);
		}

		//Simple Statistical Functions
		// Probability of at least one block
		function probability(days,prob_solving_block) {
			//Average number of blocks in "days" 
			var blocks_days = 3600*24*days/window.blockTime;
			var probability = 1 - Math.pow((1 - prob_solving_block),blocks_days);
		
			//Turn it into a percent
			return 100*probability;
		}

		//expected number of blocks solved
		function expectation(days,prob_solving_block) {
			//average number of blocks in "days" 
			var blocks_days = 3600*24*days/window.blockTime;
			var expected = blocks_days*prob_solving_block;
			return expected;
		}

		// Variance as a function of days
		function variance(days,prob_solving_block) {
			//average number of blocks in "days" 
			var blocks_days = 3600*24*days/window.blockTime;
			var variance = blocks_days*prob_solving_block*(1- prob_solving_block)
				//Return the standard deviation
			return Math.sqrt(variance);
		}
		
		// Functions for Drawing Plots

		function GenerateProbabilityGraph(probData){
			$.jqplot('ProbabilityGraph',[probData],{
				title: "Probability of Solving At Least 1 Block",
				axes:{yaxis:{min:0, label:"Probability %"},
					xaxis:{min:0,label:"Days"}}}).replot();

		}

		function GenerateExpectationGraph(expData){
			$.jqplot('ExpectationGraph',[expData],{
				title: "Expected Ether",
				axes:{yaxis:{min:0, label:"Blocks"},
					xaxis:{min:0,label:"Days"}}}).replot();

		}

		function GenerateVarianceGraph(varData){
			$.jqplot('VarianceGraph',[varData],{
				title: "Standard Deviation per Day",
				axes:{yaxis:{min:0, label:"Standard Deviation"},
					xaxis:{min:0,label:"Days"}}}).replot();

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
			
		function GenerateStdGraph(upperexpData,expData,lowerexpData){
			$.jqplot('StdGraph',[upperexpData,expData,lowerexpData],{
				title: "Expectation with 1 standard deviation limits",
				axes:{yaxis:{min:0, label:"Blocks"},
					xaxis:{min:0,label:"Days"}},
					series:[{color:'green'},{color:"#4bb2c5"},{color:'green'}]
			}).replot();

		}

		//Calculate Function

		function Calculate() {
			var hashrate = $("input[name='hashrate']").val();
			var networkHashRate = document.forms["Calculator"]["networkhashrate"].value;
			var difficulty = document.forms["Calculator"]["networkhashrate"].value;
			var prob_solving_block_network = hashrate/(networkHashRate*1e3); //GH/s	
			var prob_solving_block_difficulty = hashrate/(difficulty*1e6); //TH	
			//Set up the arrays
			var probData = new Array();
			var expData = new Array();
			var varData = new Array();
			//1 Upper Std
			var upperexpData = new Array();
			var lowerexpData = new Array();
			var currencyData = new Array();
			
			// Set number of data points. I'm using a quadratic to sample more points earlier on
			var DataPoints = 30
			//Increment to satisfy number of days
			var x = Math.sqrt(document.forms["Calculator"]["days"].value)/DataPoints;
			//var currencyConversion = document.forms["Calculator"]["exchange"].value; 

			//Dependant variable for clarity;
			var dependant = 0;
			//build a dataset
			for (i=1; i<=30; i++){
			// I'm using a quadratic to get more data points earlier than later, so total is 2 weeks
			dependant = Math.pow(i*x,2);
			
			// Only run this once and store as a variable to calculate std fluctuation
			var expResult = expectation(dependant,prob_solving_block_network,5);
			var varResult =  variance(dependant,prob_solving_block_network);
	
			probData.push([dependant,probability(dependant,prob_solving_block_network)]);
			expData.push([dependant,expResult]);
			varData.push([dependant,varResult]);

			upperexpData.push([dependant, expResult+varResult]);
			lowerexpData.push([dependant, expResult-varResult]);
			//currencyData.push([dependant, expResult*currencyConversion]);	
			
			GenerateProbabilityGraph(probData);
			GenerateExpectationGraph(expData);
			GenerateVarianceGraph(varData);
			GenerateStdGraph(upperexpData,expData,lowerexpData);
			//GenerateCurrencyGraph(currencyData);
			}	
		}




  // Form Validation

  function validateForm()
{
  hashrate = $("input[name='hashrate'").val();
  if (hashrate !== "" && !$.isNumeric(hashrate)) {
    alert("Your hashrate is required");
    return false;
  }
  // Plot requirements
  //if (typeof($("input[name='exchange']").val) != number) ||  (typeof($("input[name='exchange']").val) != number) 
  
  return true;
}


