angular.module('ethMiningCalc')
  .controller('CalcController', ['$scope', '$timeout', 'MarketDataService', 'CalcService', 'ProbabilityChartService', 'VarianceChartService', function($scope, $timeout, marketDataService, CalcService, probabilityChartService, varianceChartService) {
    //
    // Define controller functionality
    //

    /**
     * Specify Plots
     * 
     */
    var plotOptions = {};
    plotOptions.days = 10;
    plotOptions.points = 50;
    plotOptions.plots = {
      probability: {
        title: "Probability of Solving at Least One Block",
        id: "ProbabilityGraph",
        enabled: true
      },
      expectedBlocks: {
        title: "Expected Solved Blocks",
        id: "ExpectedBlocksGraph",
        enabled: true
      },
      expectedCurrency: {
        title: "Expected Return",
        id: "ExpectedReturnGraph",
        enabled: true
      },
      expectedBlocksDifficulty: {
        title: "Expected Solved Blocks - Based on Difficulty",
        enabled: false 
      },
      expectedCurrencyDifficulty: {
        title: "Expected Return - Based on Difficulty",
        enabled: false 
      },
      predictiveDifficulty: {
        title: "Predicted Difficulty",
        enabled: false
      }
    };

    /**
     * Specify currencies
     * 
     */
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
      var results = CalcService.calculate(inputs, plotOptions);
      buildTable(results.table);
      $timeout(function() { buildCharts(results.charting); })
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
          inputs.crypto_block = 5; // TODO: Generalise this for other crypto (make an input)
          currencies.usd.ethRate = marketData.usd_eth;
          currencies.aud.ethRate = marketData.aud_eth;
          setCurrencyCode('aud');
          updateCurrency();
        });
      });


    /**
     * A user has pressed the 'calculate' button
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
     * @param {object} tableData The table object returned from the calculation function
     */
    var buildTable = function(tableData) {
      $scope.table = tableData;
    }
    
    /**
     * Draw the highcharts charts
     * 
     * @param {object} chartData The charting object returned from the calculation function
     */
    var buildCharts = function(chartData) {
      if (plotOptions.plots.probability.enabled) {
        probabilityChartService.generate('#ProbabilityGraph', "Probability of Solving at Least One Block", chartData.probData, "Days", "Probability (%)", "<b>{series.name}: {point.y:.2f}% </b><br>", "Days: {point.x: .2f}");
      }
      if (plotOptions.plots.expectedBlocks.enabled) {
      varianceChartService.generate("#ExpectedBlocksGraph", "Expected Solved Blocks", "Solved Blocks", chartData.expectedBlocks, true);
      }
      if (plotOptions.plots.expectedCurrency.enabled) {
      varianceChartService.generate("#ExpectedReturnGraph", "Expected Return (" + inputs.currencyCode.toUpperCase() + ")", inputs.currencyCode.toUpperCase(), chartData.currencyData, false);
      }


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
