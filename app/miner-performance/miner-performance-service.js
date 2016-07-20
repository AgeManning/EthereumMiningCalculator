angular.module('ethMiningCalc')
  .factory('MinerPerformanceService', ['$rootScope', '$location', '$window', '$timeout', 'MarketDataService', 'MinerPerformanceAnalysisService','ValidationService', 'ErrorHandlingService', function($rootScope, $location, $window, $timeout, marketDataService, minerPerformanceAnalysisService,validationService, errorHandlingService) {
    var factory = {};
    var userInputs = $location.search();

    //TODO: Generalise to Multiple Currencies
    userInputs.cryptocurrency = 'eth';

    // HARDCODED VALUES - I don't particularly want/need users to mess with these. But go nuts if you want.
    // For Details See - MinerPerformanceAnalysisService
    var predictiveDifficultySamplePoints = 15;  // Data points to sample difficulty curve. (1s for 5 points)
    var pointResolution = 300;                  // The number of points to build expectation graph

    /**
     * Reset all user inputs and start again with a fresh calc
     */
    factory.resetInputs = function() {
      $location.url($location.path());
      $window.location.reload();
    }
  
    factory.initialiseUserInputs = function() {
      userInputs = $location.search();
    }

    // I had to put this in a timeout cause sometimes the directives wouldn't be loaded.
    // Need to get a better fix - this is dodgy and probably will cause bugs if someone uses it
    // on a slow computer
    $timeout(function() {
      _.forEach(userInputs, function(value, key) {
        $rootScope.$broadcast(key, { value: value, autoAccept: true });
      });
    }, 10);

    /**
     * Register an input to the forecaster from a user. Typically called from a directive.
     *
     * @param type String labelling the input
     * @param value Object representing the value added by the user
     */
    factory.registerUserInput = function(type, value) {
      userInputs[type] = value;
      $location.search(type, value);
      $rootScope.$broadcast('userInputs-updated');
    }

    /**
     * Getter function for the userInputs obj
     *
     * @returns Object userInputs
     */
    factory.getUserInputs = function() {
      return userInputs;
    }


    /**
     * Runs an example
     *
     * @returns Promise when graphs are complete.
     */
    factory.runExample = function() {
      $rootScope.$broadcast('hashRate', {value: 41, "autoAccept": true});
      $rootScope.$broadcast('minerAddress', {value: "0x8e68c0c9B5275fa684291304af9cafe6ceAf2772", "autoAccept": true});
      $rootScope.$broadcast('pastBlocks', {value: 40, "autoAccept": true});
    }



    /**
     * Loads blocktime of the current cryptocurrency.
     *
     * @returns Promise
     */
     var loadBlockTime = function() {
      return new Promise(function(resolve,reject){
      // Loads Current Block Time
      marketDataService.blockTime(userInputs.cryptocurrency)
        .then(function(result) {
          $rootScope.$apply(function() {
            userInputs.blockTime = result;
            resolve(result);
          });
        })
        .catch(function(err) {
            userInputs.blockTime = 0;
            errorHandlingService.handleError(err);
            reject();
        });
      });
     }

     // Make loadBlockTime accessible to controller
     factory.loadBlockTime = loadBlockTime;

    /**
     * Function to generate all graphs given we have the required data.
     *
     *  Called from factory.analyse
     *
     *  Input - Block Time
     *
     *  @Returns a Promise with data for the performance graph
     */
    var analysePerformance = function(blockTime) {
          // Build data-set required by MinerPerformanceAnalysisService
          var inputObj = {};
          inputObj.noPoints = predictiveDifficultySamplePoints;
          inputObj.dataPoints = pointResolution;
          inputObj.performance = {}; // To adapt to legacy version
          inputObj.blockTime = blockTime
          inputObj.performance.address = userInputs.minerAddress;
          inputObj.performance.pastBlocks = userInputs.pastBlocks;
          inputObj.hashRate = userInputs.hashRate;

          return minerPerformanceAnalysisService.checkMinerPerformance(inputObj);
    }


    /**
     * Generate plots & results
     */
    factory.analyse = function() {
      // Need to make sure we have block time to compute this.
      return new Promise(function(resolve,reject){
        if (userInputs.blockTime == undefined){
            loadBlockTime() // Get Block Time Promise
              .then(function(blockTime){
                //TODO: Paul UI Repsonse
                var invalidObjects = validationService.validateAnalyse(userInputs);
                  
                resolve(analysePerformance(blockTime)); //Resolve a promise with the data we need
                })
          .catch(function(err) {
            errorHandlingService.handleError(err);
            reject();
          });
        } else { // We don't need to get the blockTime (already generated)

          //TODO: Paul UI Repsonse
          var invalidObjects = validationService.validateAnalyse(userInputs);

          resolve(analysePerformance(userInputs.blockTime));

       };

      });
    }


  return factory;

  }]);
