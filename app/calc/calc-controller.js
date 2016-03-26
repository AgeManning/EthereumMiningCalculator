angular.module('ethMiningCalc')
  .controller('CalcController', ['$scope', 'MarketDataService', 'CalcService', function($scope, marketDataService, CalcService) {
    //
    // Define controller functionality
    //
    var currencies = {  // TO DO: pull exhange rates from server
      aud: {
        ethRate: 0
      },
      usd: {
        ethRate: 0
      }
    };

    var updateCurrency = function() {
      inputs.currencyRate = currencies[inputs.currencyCode].ethRate;
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
          inputs.currencyCode = 'aud';
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
     * Generate Reports
     */
    var table = {};
    var doCalculations = function() {
      var results = CalcService.calculate(inputs, plotOptions);
      $scope.table = results.table;
    }

    //
    // Define the components to be mapped to the view
    //
    $scope.inputs = inputs;
    $scope.updateCurrency = updateCurrency;
    $scope.plotOptions = plotOptions;
    $scope.calculate = doCalculations;
    $scope.table = table;

  }]);