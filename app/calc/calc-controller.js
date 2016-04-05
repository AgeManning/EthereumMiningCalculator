angular.module('ethMiningCalc')
  .controller('CalcController', ['$http','$scope', '$timeout', 'MarketDataService', 'CalcService', 'GethDataService', 'ProbabilityChartService', 'VarianceChartService','PredictiveDifficultyChartService','MinerPerformanceChartService','PredictionService','dataPredictionService','minerPerformanceService', function($http,$scope, $timeout, marketDataService, CalcService, gethDataService, probabilityChartService, varianceChartService,predictiveDifficultyChartService,minerPerformanceChartService,PredictionService,dataPredictionService,minerPerformanceService) {
    //
    // Define controller functionality
    //

    /**
     * Default Values
     * 
     */
    var plotOptions = {};
    // Default Values
    plotOptions.days = 30;
    plotOptions.points = 100;

    plotOptions.plots = {
      probability: {
        title: "Probability of Solving at Least One Block",
        id: "ProbabilityGraph",
        enabled: true
      },
      predictiveDifficulty: {
        title: "Predicted Difficulty",
        id: "PredictiveDifficultyGraph",
        enabled: false
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
      minerPerformance: {
        title: "Miner Performance",
        id: "MinerPerformance",
        enabled: true
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
        title: "Fixed Difficulty",
        form: ""
      },
      automatic: {
        title: "Predictive - Automatic - Find Best Fit",
        form: ""
      },
      linear: {
        title: "Predictive - Linear",
        form: "D = a*B + b"
      },
      quadratic: {
        title: "Predictive - Quadratic",
        form: "D= a*B^2 + b*B + c"
      },
      exponential: {
        title: "Predictive - Exponential",
        form: "D = Aexp(bx)"
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
      if (code=="eth"){ 
        $scope.allowedPredicition = false;// TODO: Implement only predictive difficulty for ETH
      };
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

    var updateCryptoCurrency = function(code) {
      loadMarketData(code, inputs.currencyCode)
        .then(function(){
          if($scope.userHasCalculated) {
            var results = CalcService.calculate(inputs, plotOptions);
            buildTable(results.table);
            $timeout(function() { buildCharts(results.charting); })
          };
        });
    };

    /**
     * Pull data from sources and hold onto it (why its in the controller). 
     * Only update this data if we really need to, its API expensive.
     * This only gets called if predictiveDataInputVariablesHasChanged == true
     */
    var updatePredictiveData = function(){
      //Build input dataset
      var inputData = {}
      inputData.pastDays = inputs.predictionPastDays;
      inputData.blockTime = inputs.blockTime;
      inputData.curBlock = currentBlock;
      inputData.curDifficulty = inputs.difficulty;
      inputData.NoPoints = inputs.predictionNoPoints;
      return dataPredictionService.getPredictionData(inputData);
    }
    /**
     * Set the Difficulty Type
     * 
     */
    var setDifficultyType = function(type) {
      inputs.difficultyType = type;
      if (type == "fixed"){
        $scope.predictiveDifficulty=false;
      }else{
        $scope.predictiveDifficulty=true;
        plotOptions.plots.predictiveDifficulty.enabled = true;
      };
      updateDifficulty(type);
    }

    /**
     * Update the Difficulty Variables 
     * 
     */
    var updateDifficulty = function(type) {
      if (predictiveDataInputVariablesHasChanged){ //Reload predictive data
        updatePredictiveData()
          .then(function(predictData){
            predictionData = predictData;
            predictiveDataInputVariablesHasChanged = false; //Change the flag back to false;
            $scope.$apply(function() {
              inputs.predictionVariables = PredictionService.predict(type,predictionData);
              inputs.difficultyType = inputs.predictionVariables.type; // Incase it changes from automatic predictor
            });
          });
      }else{
        //Call Predictive Service
        PredictionService.predict(type,predictionData);
        $scope.$apply(function() {
          inputs.predictionVariables = predictionVariables;
        });
      };
    //TODO: Update Graphs If necessary
      //if $scope.predictiveDifficulty 
      //difficultyDataService.get(inputs.cryptoCurrencyCode);
      //predictDifficultyService.predict(type);
      //if ($scope.userHasCalculated){
      //var results = CalcService.calculate(inputs, plotOptions);
      //buildTable(results.table);
      // $timeout(function() { buildCharts(results.charting); })
      //}
    }

    var loadMarketData = function(cryptoCurrencyCode, currencyCode){
      return new Promise(function(resolve){
      marketDataService.get(cryptoCurrencyCode,currencyCode)
        .then(function(marketData) {
          $scope.$apply(function() {
            inputs.networkHashRate = marketData.networkHashRate;
            inputs.difficulty = marketData.difficulty;
            inputs.blockTime = marketData.blockTime;
            currentBlock = marketData.currentBlock;
            currencies.usd.cryptoRate = Math.round(marketData.usd_crypto*100)/100; // I spose we only care about 2dp
            currencies.aud.cryptoRate = Math.round(marketData.aud_crypto*100)/100;
            setCurrencyCode(currencyCode); //Default to AUD
            });
          });
      resolve();
      });
    };


    var inputs = {};
    predictionData = {}; // Global Object to store predictive data
    inputs.costs = {};
    inputs.performance = {};
    inputs.costs.powerConsumption = 0; //Default no costs
    inputs.costs.cur_kwh =0;
    inputs.costs.initialInvestment =0 // TODO: Validate these variables and not set as default.
    inputs.performance.address=0;
    inputs.performance.pastBlocks=0;
    $scope.predictiveDifficulty=false; //Only predictive difficulty for ETH
    predictiveDataInputVariablesHasChanged = true; //Need to create predictive data for the first time.
    inputs.currencyCode='aud' //By Default
    inputs.hashRate = undefined;
    inputs.difficultyType='fixed'; // Default to fixed Difficulty
    inputs.predictionNoPoints= 15; //The number of data points to match to
    inputs.predictionPastDays= 100; //The number of days to look back to learn difficulty
    loadMarketData('eth','aud'); // Load initial Market Data with defaults
    setCryptoCurrencyCode('eth');
    //Removed: Check we have a running geth node for predictive difficulty
    //$scope.hasGethNode = gethDataService.availableGethNode(2244733); 




    /**
     * A user has pressed the 'calculate' button
     */
    var doCalculations = function() {
      var results = CalcService.calculate(inputs, plotOptions,predictionData, $scope.predictiveDifficulty);
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
        probabilityChartService.generate('#' + plotOptions.plots.probability.id, chartData.probData);
      }
      if (plotOptions.plots.expectedBlocks.enabled) {
      varianceChartService.generate("#ExpectedBlocksGraph", "Expected Solved Blocks", "Solved Blocks", chartData.expectedBlocks, true);
      }
      if (plotOptions.plots.expectedCurrency.enabled) {
      varianceChartService.generate("#ExpectedReturnGraph", "Expected Return (" + inputs.currencyCode.toUpperCase() + ")", inputs.currencyCode.toUpperCase(), chartData.currencyData, false);
      }
      if (plotOptions.plots.predictiveDifficulty.enabled && $scope.predictiveDifficulty) {
        predictiveDifficultyChartService.generate("#" +plotOptions.plots.predictiveDifficulty.id, chartData.predictiveDifficulty);
      }
    }   
    

    // Place Holder I spose until Paul gives the UI direction
    // Will do proper validation later
    var checkMinerPerformance = function(){
      if(inputs.performance.address != undefined){
        if ((inputs.performance.address.length == 42) && inputs.hashRate !=0){
          minerPerformanceService.checkMinerPerformance(inputs).then(function(dataSet){
          //Build Miner Performance Graph
          if(dataSet == undefined){
            return;
          };
          plotOptions.plots.minerPerformance.enabled = true;
          minerPerformanceChartService.generate("#"+plotOptions.plots.minerPerformance.id, dataSet);

          });
        };
      };
    };



    //
    // Define the components to be mapped to the view
    //
    $scope.inputs = inputs;
    $scope.difficulties = difficulties;
    $scope.setDifficultyType = setDifficultyType;
    $scope.setCurrencyCode = setCurrencyCode;
    $scope.setCryptoCurrencyCode = setCryptoCurrencyCode;
    $scope.updateCurrency = updateCurrency;
    $scope.currencies = currencies;
    $scope.cryptoCurrencies = cryptoCurrencies;
    $scope.plotOptions = plotOptions;
    $scope.calculate = doCalculations;
    $scope.table = {};
    $scope.userHasCalculated = false;
    $scope.checkMinerPerformance = checkMinerPerformance;

  }]);
