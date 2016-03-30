angular.module('ethMiningCalc')
  .controller('CalcController', ['$http','$scope', '$timeout', 'MarketDataService', 'CalcService', 'GethDataService', 'ProbabilityChartService', 'VarianceChartService', function($http,$scope, $timeout, marketDataService, CalcService, gethDataService, probabilityChartService, varianceChartService) {
    //
    // Define controller functionality
    //

    // Defaults

    /**
     * Specify Plots
     * 
     */
    var plotOptions = {};
    // Default Values
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
        cryptoRate: 0
      },
      usd: {
        title: "US Dollar (USD)",
        cryptoRate: 0
      },
      other: {
        title: "Other",
        cryptoRate: 0
      }
    };
    
    var cryptoCurrencies = {
      eth: {
        title: "Ethereum (ETH)",
        crypto_Block: 5
      },
      btc: {
        title: "Bitcoin (BTC)",
        crypto_Block: 25 //May need to pull this data. It changes in July 2016
      },
      other: {
        title: "Other",
        crypto_Block: 0
      }
    };

    var difficulties = {
      fixed: {
        title: "Fixed"
      },
      linear: {
        title: "Predictive - Linear"
      },
      quadratic: {
        title: "Predictive - Quadratic"
      },
      exponential: {
        title: "Predictive - Exponential"
      }
    };

    /**
     * Specify a currency code
     * 
     * @param {string} code A currency code (eg, aud)
     */
    var setCurrencyCode = function(code) {
      inputs.currencyCode = code;
      inputs.currencyRate = currencies[inputs.currencyCode].cryptoRate;
      updateCurrency();
    };
   
    var setCryptoCurrencyCode = function(code){
      inputs.cryptoCurrencyCode = code;
      inputs.cryptoTitle = cryptoCurrencies[code].title;
      inputs.crypto_Block = cryptoCurrencies[code].crypto_Block;
      updateCryptoCurrency(code);
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

    // TODO: Implement this correctly
    var updateCryptoCurrency = function(code) {
      //TODO: Re-run market Data Service
      loadMarketData(code, inputs.currencyCode);
    };

    /**
     * Update the Difficulty Type
     * Place Holder to implement predictive difficulties
     */
    var updateDifficultyType = function(type) {
      //Call Predictive Service
      //difficultyDataService.get(inputs.cryptoCurrencyCode);
      //predictDifficultyService.predict(type);
      //if ($scope.userHasCalculated){
      //var results = CalcService.calculate(inputs, plotOptions);
      //buildTable(results.table);
      // $timeout(function() { buildCharts(results.charting); })
      //}
    }

    var loadMarketData = function(cryptoCurrencyCode, currencyCode){
      marketDataService.get(cryptoCurrencyCode,currencyCode)
        .then(function(marketData) {
          $scope.$apply(function() {
            inputs.networkHashRate = marketData.networkHashRate;
            inputs.difficulty = marketData.difficulty;
            inputs.blockTime = marketData.blockTime;
            currencies.usd.cryptoRate = marketData.usd_crypto;
            currencies.aud.cryptoRate = marketData.aud_crypto;
            setCurrencyCode(currencyCode); //Default to AUD
            });
          });
        };


    var inputs = {};
    inputs.currencyCode='aud' //By Default
    inputs.hashRate = undefined;
    inputs.difficultyType='fixed'; // Default to fixed Difficulty
    // Check we have a running geth node for predictive difficulty
    $scope.hasGethNode = gethDataService.availableGethNode(2244733); 
    loadMarketData('eth','aud'); // Load initial Market Data with defaults
    setCryptoCurrencyCode('eth');




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
    $scope.setCryptoCurrencyCode = setCryptoCurrencyCode;
    $scope.updateCurrency = updateCurrency;
    $scope.currencies = currencies;
    $scope.cryptoCurrencies = cryptoCurrencies;
    $scope.plotOptions = plotOptions;
    $scope.calculate = doCalculations;
    $scope.table = {};
    $scope.userHasCalculated = false;

  }]);
