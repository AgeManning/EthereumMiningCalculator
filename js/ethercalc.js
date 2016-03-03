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
    function GenerateStandardGraph(id,title,data,xtitle,ytitle,toolTipHeader,toolTipFormat) {
			$(id).highcharts({
        chart: {
          zoomType: 'x'
        },
				title: {
          text: title,
          x: -20
        },
        xAxis: {title: { text:  xtitle} },
        yAxis: {
          title: { text: ytitle
          },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
        },
        tooltip:{
          headerFormat: toolTipHeader,
          pointFormat: toolTipFormat 
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [{
          name: ytitle,
          marker: { enabled: false },
          data: data
        }]
      });
    }

    

    function GenerateExpectationVarianceGraph(expData,stdData,std2UpperData,std2LowerData,maxPlotValue,minPlotValue) 
{
			$('#StdGraph').highcharts({
        chart: {
          zoomType: 'xy',
        },
				title: {
          text: "Expected Solved Blocks with Variance",
          x: -20
        },
        xAxis: {title: { text:  "Days"},
            min:0,
            max: expData[expData.length-1][0]
        },
        yAxis: {
          title: { text: "Solved Blocks"},
          min: 0,
          max: maxPlotValue[1][2],
          endOnTick: false,
          plotLines: [{
            color: 'black',
            width: 1,
            dashStyle: "Solid",
            label: {
              align: "right",
              text: "1 Block\u00A0\u00A0\u00A0\u00A0",
              style: {
                fontWeight: "bold"
              }
            },
            value: 1
          }],
          },
        tooltip:{
        },
        legend: {
          enabled: true

        },
        credits: {
          enabled: false
        },
        series: [
       {
          name: "1 Sigma",
          type: "arearange",
          data: stdData,
          color: 'green',
          lineWidth: 0,
          marker: { enabled: false },
          tooltip: {
            headerFormat: "<b>64.2%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:,0.2f} Range: {point.low:0.2f} - {point.high:0.2f}"
          },
          fillOpacity: 0.3
        },{
          name: "1-2 \u03C3",
          type: "arearange",
          data: std2UpperData,
          color: "#ffff66",
          lineWidth: 0,
          marker: { enabled: false },
          tooltip: {
            headerFormat: "<b>13.6%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:,0.2f} Range: {point.low:0.2f} - {point.high:0.2f}"
          },
          fillOpacity: 0.3
        },{
          name: "Std Lower",
          type: "arearange",
          data: std2LowerData,
          color: "#ffff66",
          marker: { enabled: false },
          fillOpacity: 0.3,
          showInLegend: false,
          tooltip: {
            headerFormat: "<b>13.6%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:,0.2f} Range: {point.low:0.2f} - {point.high:0.2f}"
          },
          lineWidth: 0
        },{ 
          name: "> 2\u03C3",
          type: "arearange",
          data: maxPlotValue,
          marker: { enabled: false },
          color: "red",
          fillOpacity: 0.3,
          showInLegend: true,
          tooltip: {
            headerFormat: "<b>2.1%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:,0.2f} Range: {point.low:0.2f} -  \u221E"
          },
          lineWidth: 0
        },{ 
          name: "Min Plot Value",
          type: "arearange",
          data: minPlotValue,
          marker: { enabled: false },
          color: "red",
          fillOpacity: 0.3,
          showInLegend: false,
          tooltip: {
            headerFormat: "<b>2.1%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:0.2f} Range: {point.low:0.2f} - {point.high:0.2f}"
          },
          lineWidth: 0
        },{ 
          name: "Average",
          type: 'spline',
          lineWidth: 2,
          marker: { enabled: false },
          data: expData,
          tooltip: {
            headerFormat: "<b>Expected Blocks (Average)</b><br>",
            pointFormat: "Day: {point.x:0.2f} Expected: {point.y:0.2f}"
          },
          color: "green"
        }]
      });
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
      var daysToCompute = $("input[name='days']").val();
			var prob_solving_block_network = hashrate/(networkHashRate*1e3); //GH/s	
			var prob_solving_block_difficulty = hashrate/(difficulty*1e6); //TH	
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
			var DataPoints = $("input[name='datapoints']").val();
			//Increment to satisfy number of days
      //Quadratic Plotting in Graphs
      //var x = Math.sqrt(daysToCompute)/DataPoints;
      // Linear Plotting in Graphs
      var x = daysToCompute/(DataPoints-1);
			//var currencyConversion = document.forms["Calculator"]["exchange"].value; 

			//Dependent variable for clarity;
			var dependent = 0;

      // Find Maximum Expectation Value and Variance to Fill Sdd Graph
      // Will Fill the rest of this graph representing beyond 2 sigma
      var maximumVal = expectation(daysToCompute,prob_solving_block_network) + 2*variance(daysToCompute,prob_solving_block_network);

			//build a dataset
			for (i=1; i<=DataPoints; i++){
			// I'm using a quadratic to get more data points earlier than later, so total is Number of Days
      // Quadratic
			//dependent = Math.pow(i*x,2);
		  // Linear
      dependent = (i-1)*x;
      
			// Only run this once and store as a variable to calculate std fluctuation
			var expResult = expectation(dependent,prob_solving_block_network);
			var varResult =  variance(dependent,prob_solving_block_network);
      
			probData.push([dependent,probability(dependent,prob_solving_block_network)]);
			expData.push([dependent,expResult]);
			varData.push([dependent,varResult]);
   


      //STD Plot Stuff
      stdData.push([dependent,Math.max(0,expResult - varResult), expResult + varResult]);
      std2LowerData.push([dependent,Math.max(0,expResult - 2*varResult), Math.max(expResult - varResult)]);
      std2UpperData.push([dependent,expResult + varResult, expResult + 2*varResult]);
      
      maximumPlotValue.push([dependent,expResult + 2*varResult,maximumVal*1.1]);
      lowerPlotValue.push([dependent,0,Math.max(0,expResult - 2*varResult)]);

      }
      //Generate the graphs
      //Generate Probability Graph
      GenerateStandardGraph('#ProbabilityGraph',"Probability of Solving at Least One Block", probData,"Days","Probability (%)", "<b>{series.name}: {point.y:.2f}% </b><br>" , "Days: {point.x: .2f}");
      //Generate Expectation Graph 
      GenerateStandardGraph('#ExpectationGraph',"Expected Number of Solved Blocks", expData,"Days","Solved Blocks", "<b>{series.name}: {point.y:.2f} </b><br>" , "Days: {point.x: .2f}");
      // Generate Std Graph
      GenerateStandardGraph('#VarianceGraph',"Standard Deviation", varData,"Days","Solved Blocks", "<b>{series.name}: {point.y:.2f} </b><br>" , "Days: {point.x: .2f}");
      //Generate Expectation with Variance Widths
      GenerateExpectationVarianceGraph(expData,stdData,std2UpperData,std2LowerData,maximumPlotValue,lowerPlotValue);

//			GenerateExpectationGraph(expData);
//			GenerateVarianceGraph(varData);
//			GenerateStdGraph(upperexpData,expData,lowerexpData);
			//GenerateCurrencyGraph(currencyData);
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


