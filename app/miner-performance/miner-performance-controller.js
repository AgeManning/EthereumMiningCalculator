angular.module('ethMiningCalc')
  .controller('MinerPerformanceController', ['$scope', '$timeout', '$anchorScroll', '$location', 'MinerPerformanceService', "MinerPerformanceChartService", function($scope, $timeout, $anchorScroll, $location, minerPerformanceService, minerPerformanceChartService) {

    var isVisible = {
      hashRate: true
    }

    var userHasCalculated = false;
    var updateVisibilities = function() {
      inputs = minerPerformanceService.getUserInputs();

      isVisible.hashRate = true;

      isVisible.minerAddress = (function(){
      if(inputs.hashRate == undefined) { return false;}
      return true;
      })();

      isVisible.pastBlocks = (function() {
        if (inputs.hashRate === undefined) { return false; }
        if (inputs.minerAddress === undefined) { return false; }
        return true;
      })();

      isVisible.analyse = (function() {
        if (inputs.pastBlocks === undefined) { return false; }
        return true;
      })();

    }

    var inputs = minerPerformanceService.getUserInputs();
    $scope.inputs = inputs;
    updateVisibilities();

    $scope.$on('userInputs-updated', function() {
        updateVisibilities();
        $location.hash('miner-performance-inputs');
        $anchorScroll();
    });
    $scope.logInputs = function() {
      console.log(forecasterService.getUserInputs());
    }

    /**
     * Perform all the analysis.
     *
     */
    var analyse = function() {
      minerPerformanceService.analyse()
        .then(function(dataSet){
          // $scope.$apply is needed as we are doing some async stuff in the background
          $scope.$apply(function() {
            $scope.userHasCalculated = true; // Show tables and plots.
            $location.hash('miner-performance-top');
            $anchorScroll();
          });
          $timeout(function() {
            minerPerformanceChartService.generate("#miner-performance", dataSet); // Build the graph;
            $(window).trigger('resize');
          })
        })
          .catch(function() {
            console.log("Couldn't perform the analysis"); //TODO: Deal with this in the UI
          });
    };

    $scope.isVisible = isVisible;
    $scope.reset = minerPerformanceService.resetInputs;
    $scope.analyse = analyse;
    $scope.userHasCalculated = false;

    var init = function () { // Load the block time on page load
      minerPerformanceService.loadBlockTime();
    }
    init(); //Load the block time


  }]);
