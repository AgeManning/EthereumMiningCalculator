angular.module('ethMiningCalc')
  .controller('ForecasterController', ['$scope', '$timeout', 'ForecasterService', 'ProbabilityChartService', 'PredictiveDifficultyChartService','VarianceChartService', function($scope, $timeout, forecasterService,probabilityChartService, predictiveDifficultyChartService, varianceChartService) {

    var isVisible = {
      cryptocurrency: true
    }

    var userHasCalculated = false;
    var updateVisibilities = function() {
      inputs = forecasterService.getUserInputs();

      isVisible.cryptocurrency = true;

      isVisible.complexityType = (function(){
      if(inputs.cryptocurrency == undefined) { return false;}
      return true;
      })();

      isVisible.hashRate = (function() {
        if (inputs.complexityType === undefined) { return false; }
        if (inputs.cryptocurrency === undefined) { return false; }
        return true;
      })();

      isVisible.difficultyType = (function() {
        if (inputs.complexityType === undefined) { return false; }
        if (inputs.cryptocurrency === undefined) { return false; }
        if (inputs.hashRate === undefined) { return false; }
        if (inputs.cryptocurrency !== 'eth') { return false; }
        return true;
      })();

      isVisible.predictiveDifficultyPastDays = (function() {
        if (inputs.complexityType === 'default') { return false; }
        if (inputs.difficultyType === 'none') { return false; }
        if (inputs.hashRate === undefined) { return false; }
        if (inputs.difficultyType === undefined) { return false; }
        if (inputs.cryptocurrency !== undefined) { return true; }
        return false;
      })();

      isVisible.predictiveDifficultyPointCount = (function() {
        if (inputs.complexityType === 'default') { return false; }
        if (inputs.difficultyType === 'none') { return false; }
        if (inputs.difficultyType === undefined) { return false; }
        if (inputs.predictiveDifficultyPastDays !== undefined) { return true; }
        return false;
      })();

      isVisible.cryptoPrice = (function() {
        if (inputs.cryptocurrency === undefined) { return false; }
        if (inputs.hashRate === undefined) { return false; }
        if (inputs.cryptocurrency !== 'eth') { return true; }
        if (inputs.complexityType !== undefined && inputs.complexityType === "default") { return true; }
        if (inputs.complexityType !== "default" && inputs.predictiveDifficultyPointCount !== undefined) {return true;}
        return false;
      })();

      isVisible.currentDifficulty = (function() {
        if (inputs.hashRate === undefined) { return false; }
        if (inputs.cryptocurrency === undefined) { return false; }
        if (inputs.cryptocurrency !== 'eth') { return true; }
        if (inputs.cryptoPrice !== 0 && inputs.cryptoPrice !== undefined) {return true;}
        return false;
      })();

      isVisible.blockTime = (function() {
        if (inputs.hashRate === undefined) { return false; }
        if (inputs.currentDifficulty !== undefined) { return true; }
        return false;
      })();

      isVisible.blockReward = (function() {
        if (inputs.hashRate === undefined) { return false; }
        if ((inputs.complexityType !== "default") && (inputs.blockTime !== undefined)) { return true; }
        return false;
      })();

      isVisible.predictiveDifficultyAValue = (function() {
        if (inputs.complexityType !== 'advanced') { return false; }
        if (inputs.difficultyType == "auto") {return false;}
        if (inputs.difficultyType === 'none') { return false; }
        if (inputs.difficultyType === undefined) { return false; }
        if (inputs.blockReward !== undefined) { return true; }
        return false;
      })();

      isVisible.predictiveDifficultyBValue = (function() {
        if (inputs.complexityType !== 'advanced') { return false; }
        if (inputs.difficultyType === 'none') { return false; }
        if (inputs.difficultyType === undefined) { return false; }
        if (inputs.predictiveDifficultyAValue !== undefined) { return true; }
        return false;
      })();

      isVisible.predictiveDifficultyCValue = (function() {
        if (inputs.complexityType !== 'advanced') { return false; }
        if (inputs.difficultyType !== 'quadratic') { return false; }
        if (inputs.predictiveDifficultyBValue !== undefined) { return true; }
        return false;
      })();

      isVisible.minerExpenseInclusion = (function() {
        if (inputs.hashRate === undefined) { return false; }
        if (inputs.blockReward !== undefined && inputs.complexityType !== "advanced") { return true; }
        if (inputs.difficultyType === "auto" && inputs.blockReward !== undefined) {return true;}
        if (inputs.difficultyType !== "quadratic" && inputs.predictiveDifficultyBValue !== undefined) { return true; }
        if (inputs.predictiveDifficultyCValue !== undefined) { return true; }
        return false;
      })();

      isVisible.initialInvestment = (function() {
        if (inputs.minerExpenseInclusion === "enable" && inputs.blockReward !== undefined) { return true; }
        return false;
      })();

      isVisible.electricityUsage = (function() {
        if (inputs.minerExpenseInclusion === "enable" && inputs.initialInvestment !== undefined) { return true; }
        return false;
      })();

      isVisible.electricityRate = (function() {
        if (inputs.minerExpenseInclusion === "enable" && inputs.electricityUsage !== undefined) { return true; }
        return false;
      })();

      isVisible.plotDays = (function() {
        if (inputs.hashRate === undefined) { return false; }
        if (inputs.minerExpenseInclusion === "disable") { return true; }
        if (inputs.minerExpenseInclusion === "enable" && inputs.electricityRate !== undefined) { return true; }
        return false;
      })();

      isVisible.plotResolution = (function() {
        if (inputs.complexityType === "advanced" && inputs.plotDays !== undefined) { return true; }
        return false;
      })();

      isVisible.calculate = (function() {
        if (inputs.complexityType === "advanced" && inputs.plotResolution !== undefined) { return true; }
        if (inputs.complexityType !== "advanced" && inputs.plotDays !== undefined) { return true; }
        return false;
      })();

    }

    isVisible.ProbabilityGraph = true;
    var inputs = forecasterService.getUserInputs();
    $scope.inputs = inputs;
    updateVisibilities();

    $scope.$on('userInputs-updated', updateVisibilities);
    $scope.logInputs = function() {
      console.log(forecasterService.getUserInputs());
    }



    // Variables for displaying Graphs in HTML

    var plotOptions = {};
    // Default Values

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
      minerPerformance: {
        title: "Miner Performance",
        id: "MinerPerformance",
        enabled: false 
      }
    };

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
      varianceChartService.generate("#ExpectedReturnGraph", "Expected Return (" + inputs.cryptocurrency.toUpperCase() + ")", inputs.cryptocurrency.toUpperCase(), chartData.currencyData, false);
      }
      if (inputs.difficultyType != 'none') {
        predictiveDifficultyChartService.generate("#" +plotOptions.plots.predictiveDifficulty.id, chartData.predictiveDifficulty);
      }
    }   

    //$scope.inputs = forecasterService.inputs;
    $scope.isVisible = isVisible;

    $scope.reset = forecasterService.resetInputs;

    $scope.calculate = function() {
      if (inputs.difficultyType != 'none'){ plotOptions.plots.predictiveDifficulty.enabled = true;};
      forecasterService.calculate()
        .then(function(results){
          $scope.userHasCalculated = true; // Show tables and plots. 
          console.log(inputs);
          console.log(results);
          buildTable(results.table);
          $timeout(function() { buildCharts(results.charting); })   // $timeout is used here so we draw the charts after we have removed the hidden class from the chart containers
        });
    };

  var buildTable = function(tableData) {
    $scope.table = tableData;
  }
    $scope.userHasCalculated = false;
    $scope.plotOptions = plotOptions;

  }]);
