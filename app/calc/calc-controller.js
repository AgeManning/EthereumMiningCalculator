angular.module('ethMiningCalc')
  .controller('CalcController', ['$scope', '$timeout', 'MarketDataService', 'CalcService', 'ProbabilityChartService', 'VarianceChartService', function($scope, $timeout, marketDataService, CalcService, probabilityChartService, varianceChartService) {
    //
    // Define controller functionality
    //
    var currencies = {  // TO DO: pull exhange rates from server
      aud: {
        title: "Australian Dollar (AUD)",
        ethRate: 0
      },
      usd: {
        title: "US Dollar (USD)",
        ethRate: 0
      },
      other: {
        title: "Other",
        ethRate: 0
      }
    };

    /**
     * Specify a currency code
     * 
     * @param {string} code A currency code (eg, aud)
     */
    var setCurrencyCode = function(code) {
      inputs.currencyCode = code;
      inputs.currencyRate = currencies[inputs.currencyCode].ethRate;
      updateCurrency();
    }
    
    /**
     * Update the reporting currency
     */
    var updateCurrency = function() {
      if($scope.userHasCalculated) {
        buildTable(CalcService.calculate(inputs, plotOptions).table);
      }
    };

    var inputs = {};
    inputs.hashRate = undefined;
    marketDataService.get()
      .then(function(marketData) {
        $scope.$apply(function() {
          inputs.networkHashRate = marketData.networkHashRate;
          inputs.difficulty = marketData.difficulty;
          inputs.blockTime = marketData.blockTime;
          currencies.usd.ethRate = marketData.usd_eth;
          currencies.aud.ethRate = marketData.aud_eth;
          setCurrencyCode('aud');
          updateCurrency();
        });
      });


    var plotOptions = {};
    plotOptions.days = 10;
    plotOptions.points = 50;
    plotOptions.plots = {};
    plotOptions.plots.probability = true;
    plotOptions.plots.expectation = true;
    plotOptions.plots.expectedCurrency = true;
    plotOptions.plots.variance = true;
    plotOptions.plots.expectationVar = true;

    /**
     * A user has pressed the 'calcuate' button
     */
    var doCalculations = function() {
      var results = CalcService.calculate(inputs, plotOptions);
      buildTable(results.table);
      $scope.userHasCalculated = true;
      $timeout(function() { buildCharts(results.charting); })   // $timeout is used here so we draw the charts after we have removed the hidden class from the chart containers
    }
    
    /**
     * Expose the table data to the scope
     * 
     * @param {object} tableData The table object returned from the calcuation function
     */
    var buildTable = function(tableData) {
      $scope.table = tableData;
    }
    
    /**
     * Draw the highcharts charts
     * 
     * @param {object} chartData The charting object returned from the caluculation function
     */
    var buildCharts = function(chartData) {
      probabilityChartService.generate('#ProbabilityGraph', "Probability of Solving at Least One Block", chartData.probData, "Days", "Probability (%)", "<b>{series.name}: {point.y:.2f}% </b><br>", "Days: {point.x: .2f}");
      varianceChartService.generate("#StdGraph", chartData.expData, chartData.stdData, chartData.std2UpperData, chartData.std2LowerData, chartData.maximumPlotValue, chartData.lowerPlotValue);
    }   
    

    //
    // Define the components to be mapped to the view
    //
    $scope.inputs = inputs;
    $scope.setCurrencyCode = setCurrencyCode;
    $scope.updateCurrency = updateCurrency;
    $scope.currencies = currencies;
    $scope.plotOptions = plotOptions;
    $scope.calculate = doCalculations;
    $scope.table = {};
    $scope.userHasCalculated = false;

  }]);