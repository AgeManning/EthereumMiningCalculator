angular.module('ethMiningCalc')
  .controller('MinerPerformanceController', ['$scope', '$timeout', '$anchorScroll', '$location', 'MinerPerformanceService', "MinerPerformanceChartService", function($scope, $timeout, $anchorScroll, $location, minerPerformanceService, minerPerformanceChartService) {

    minerPerformanceService.initialiseUserInputs();

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
      $scope.loading = true;
      minerPerformanceService.analyse()
        .then(function(dataSet){
          // $scope.$apply is needed as we are doing some async stuff in the background
          $scope.$apply(function() {
            $scope.userHasCalculated = true; // Show plot.
            $location.hash('finished-calculation-position');
            $anchorScroll();
          });
          $timeout(function() {
            minerPerformanceChartService.generate("#miner-performance", dataSet); // Build the graph;
            $(window).trigger('resize');
            $scope.loading = false;
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
    $scope.loading = false;

    // Need a function to show graphs
    $scope.runExample = function() {
      minerPerformanceService.runExample(); //This broadcasts everything.
      // We wait a second for the broadcast then run analyse.
      $timeout(function() {
        analyse();
      },1);

    }

    var init = function () { // Load the block time on page load
      minerPerformanceService.loadBlockTime();
    }
    init(); //Load the block time


  }]);
