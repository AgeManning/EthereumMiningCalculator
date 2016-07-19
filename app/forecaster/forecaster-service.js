angular.module('ethMiningCalc')
  .factory('ForecasterService', ['$rootScope', '$location', '$window', '$timeout', 'MarketDataService', 'DataPredictionService','PredictionService', 'CalcService','ErrorHandlingService','ValidationService', function($rootScope, $location, $window, $timeout, marketDataService, dataPredictionService, predictionService,calcService,errorHandlingService, validationService) {
    var factory = {};
    var userInputs = $location.search();

    /**
     * Reset all user inputs and start again with a fresh calc
     */
    factory.resetInputs = function() {
      $location.url($location.path());
      $window.location.reload();
    }

    /**
     * Refresh the userInputs
     */
    factory.intitialiseUserInputs = function() {
      userInputs = $location.search();
    }

    // Going to put defaults here
    var defaultCurrency = "AUD";

    // I had to put this in a timeout cause sometimes the directives wouldn't be loaded.
    // Need to get a better fix - this is dodgy and probably will cause bugs if someone uses it
    // on a slow computer
    $timeout(function() {
      _.forEach(userInputs, function(value, key) {
        $rootScope.$broadcast(key, { value: value, autoAccept: true });
      });
    }, 10);


    var lists = {
      "cryptocurrency": {
        eth: {
          title: "Ethereum (ETH)",
          code: 'eth'
        },
        btc: {
          title: "Bitcoin (BTC)",
          code: 'btc'
        },
        other: {
          title: "Other",
          code: 'other'
        }
      },
      "complexityType": {
        def: {
          title: "Basic (Automatically choose options)",
          code: "default"
        },
        custom: {
          title: "Custom (Customise most options)",
          code: "custom"
        },
        advanced: {
          title: "Advanced (Customise all options)",
          code: "advanced"
        }
      },
      "difficultyType": {
        fixed: {
          title: "None",
          code: 'none',
          form: ""
        },
        automatic: {
          title: "Automatic (Find Best Method)",
          code: 'auto',
          form: ""
        },
        linear: {
          title: "Linear",
          code: 'linear',
          form: "D = a*x + b"
        },
        quadratic: {
          title: "Quadratic",
          code: 'quadratic',
          form: "D= a*x^2 + b*x + c"
        },
        exponential: {
          title: "Exponential",
          code: 'exponential',
          form: "D = a exp(bx)"
        }
      },
      "minerExpenseInclusion": {
        enable: {
          title: "Include Mining Expenses",
          code: 'enable'
        },
        disable: {
          title: "Ignore Miner Expenses",
          code: 'disable'
        }
      }
    };

    /**
     * Complexity Broadcast.
     * - Broadcast various options depending on complexity.
     */
    var broadcastComplexityType = function(complexityType) {
      switch(complexityType){

        case "default": // Chosen default settings. Lets broadcast them
          $rootScope.$broadcast("difficultyType", {value: "none", "autoAccept": true});
          if (userInputs.cryptoPrice === undefined){ //Only run these broadcasts if we need to
            broadcastCurrencyRates(true);
          }
          if (userInputs.currentHashRate === undefined){
            broadcastDifficultyValue(true);
          }
          if (userInputs.blockTime === undefined){
            broadcastBlockTime(true);
          }
          if (userInputs.blockReward === undefined){
            broadcastBlockReward(true);
          }
          $rootScope.$broadcast("minerExpenseInclusion", { value: "disable", "autoAccept": true});
          $rootScope.$broadcast("plotResolution", { value: 100, "autoAccept": true});
          break;


         case "custom": // Allow users to pick values. Auto-accept only some values
          if (userInputs.cryptocurrency === "eth")
            $rootScope.$broadcast("difficultyType", { value: "auto", "autoAccept": true});
          else
            $rootScope.$broadcast("difficultyType", { value: "none", "autoAccept": true});

          if (userInputs.cryptoPrice === undefined){ //Only run these broadcasts if we need to
            broadcastCurrencyRates(false);
          };
          if (userInputs.currentDifficulty === undefined){ //Only run these broadcasts if we need to
            broadcastDifficultyValue(false);
          };
          if (userInputs.blockTime === undefined){
            broadcastBlockTime(false);
          };
          if (userInputs.blockReward === undefined){
            broadcastBlockReward(false);
          }
          $rootScope.$broadcast("plotResolution", { value: 100, "autoAccept": true});
          break;

         case "advanced":
          if (userInputs.cryptocurrency !== 'eth') // No Difficulty prediction
            $rootScope.$broadcast("difficultyType", { value: "none", "autoAccept": true});

          if (userInputs.cryptoPrice === undefined){ //Only run these broadcasts if we need to
            broadcastCurrencyRates(false);
          }
          if (userInputs.currentDifficulty === undefined){ //Only run these broadcasts if we need to
            broadcastDifficultyValue(false);
          };
          if (userInputs.blockTime === undefined){
            broadcastBlockTime(false);
          }
          if (userInputs.blockReward === undefined){
            broadcastBlockReward(false);
          }
          return true;
          break;

      };
    }

    /**
     * Get current block reward and broadcast it to components
     */
    var broadcastBlockReward = function(autoAcceptFlag) {
      var broadcastChannel = 'blockReward';
      var loadingParam = {"loading": true}; // Send this to put into loading state
      // If we auto accept, bypass loading state and just leave "Loading..." as value
      if (autoAcceptFlag){
        loadingParam = {value: "Loading...", loading: true};
      }
      $rootScope.$broadcast(broadcastChannel, loadingParam);

      marketDataService.getBlockReward(userInputs.cryptocurrency)
        .then(function(blockReward) {
          $rootScope.$broadcast(broadcastChannel, { value: blockReward, "autoAccept": autoAcceptFlag });
        })
        .catch(function(err) {
          errorHandlingService.handleError(err);
          $rootScope.$broadcast(broadcastChannel, { value: 0, list: [] ,"autoAccept": autoAcceptFlag });
        });
    }

    /**
     * Get currency rate and broadcast it to components
     */
    var broadcastCurrencyRates = function(autoAcceptFlag) {
      var broadcastChannel = 'cryptoPrice';
      var loadingParam = {"loading": true}; // Send this to put into loading state
      // If we auto accept, bypass loading state and just leave "Loading..." as value
      if (autoAcceptFlag){
        loadingParam = {value: "Loading...", loading: true};
      }
      $rootScope.$broadcast(broadcastChannel, loadingParam);

      marketDataService.getRates(userInputs.cryptocurrency)
        .then(function(list) {
          var cryptoRate = 0;
          var rateCode = '';
          // find our default currency
          var ourDefaultCurrency = _.find(list, ['code', defaultCurrency]);
          if(ourDefaultCurrency) {
            cryptoRate = ourDefaultCurrency.value;
            rateCode = ourDefaultCurrency.code;
          }
          $rootScope.$broadcast(broadcastChannel, { value: cryptoRate, list: list ,"autoAccept": autoAcceptFlag });
          $rootScope.$broadcast(broadcastChannel + 'Code', { value: rateCode, "autoAccept": autoAcceptFlag });
        })
        .catch(function(err) {
          errorHandlingService.handleError(err);
          $rootScope.$broadcast(broadcastChannel, { value: 0, list: [] ,"autoAccept": autoAcceptFlag });
        });
    }

    /**
     * Get difficulty and broadcast it to components
     */
    var broadcastDifficultyValue = function(autoAcceptFlag) {
      var broadcastChannel = 'currentDifficulty'
      var loadingParam = {"loading": true}; // Send this to put into loading state
      // If we auto accept, bypass loading state and just leave "Loading..." as value
      if (autoAcceptFlag){
        loadingParam = {value: "Loading...", autoAccept: true};
      }
      $rootScope.$broadcast(broadcastChannel, loadingParam);
      marketDataService.getDifficulty(userInputs.cryptocurrency)
        .then(function(result) {
          $rootScope.$apply(function() {
            $rootScope.$broadcast(broadcastChannel, { "value": result ,"autoAccept": autoAcceptFlag });
          });
        })
       /* .catch(function(err) {
          console.log(err);
          errorHandlingService.handleError(err);
          $rootScope.$apply(function() {
            $rootScope.$broadcast(broadcastChannel, { empty: true,"autoAccept": autoAcceptFlag  });
          });
        });*/
    }

    /**
     * Get this item and broadcast it to components
     */
    var broadcastBlockTime = function(autoAcceptFlag) {
      var broadcastChannel = 'blockTime'
      var loadingParam = {"loading": true}; // Send this to put into loading state
      // If we auto accept, bypass loading state and just leave "Loading..." as value
      if (autoAcceptFlag){
        loadingParam = {value: "Loading...", autoAccept: true};
      }
      $rootScope.$broadcast(broadcastChannel, loadingParam);
      marketDataService.blockTime(userInputs.cryptocurrency)
        .then(function(result) {
          $rootScope.$apply(function() {
            $rootScope.$broadcast(broadcastChannel, { "value": result, "autoAccept": autoAcceptFlag });
          });
        })
        .catch(function(err) {
          errorHandlingService.handleError(err);
          $rootScope.$apply(function() {
            $rootScope.$broadcast(broadcastChannel, { empty: true, "autoAccept": autoAcceptFlag });
          });

        });
    }



    /**
     * Gets Prediction Variables - Called by broadcastPredictiveDifficulty
     *
     * Returns a promise once all data is loaded.
     */
    var getPredictionVariables = function(autoAcceptFlag) {
      return new Promise(function(resolve,reject){
        // Build a prediction data set
        var inputPredictionData = {};
        inputPredictionData.pastDays = userInputs.predictiveDifficultyPastDays;
        inputPredictionData.blockTime = userInputs.blockTime;
        inputPredictionData.curDifficulty = userInputs.currentDifficulty; //This takes difficulty and is measured in TH/s
        inputPredictionData.curBlock = userInputs.currentBlock
        inputPredictionData.noPoints = userInputs.predictiveDifficultyPastDays;
        // Get the Raw data for prediction
        dataPredictionService.getPredictionData(inputPredictionData)
          .then(function(predictionData){
            var predictionVariables = predictionService.predict(userInputs.difficultyType, predictionData) //Return our variables
            userInputs.predictionData = predictionData; // We need this data in the calc.
            $rootScope.$apply(function() {
              if(userInputs.difficultyType == 'auto'){ // We need to change this once it has found the best type
              autoAcceptFlag = true;
              $rootScope.$broadcast('difficultyType', { value: predictionVariables.type, autoAccept: true});

              };
              $rootScope.$broadcast('predictiveDifficultyAValue', { value: predictionVariables.a, autoAccept: autoAcceptFlag});
              $rootScope.$broadcast('predictiveDifficultyBValue', { value: predictionVariables.b, autoAccept: autoAcceptFlag});
              // Only fill C if we are using a quadratic prediction
              if (userInputs.difficultyType === "quadratic"){
                $rootScope.$broadcast('predictiveDifficultyCValue', { value: predictionVariables.c, autoAccept: autoAcceptFlag});
              }
              resolve();

            });
          })
        .catch(function(err){
          errorHandlingService.handleError(err);
        });
      });
    }


    /**
     * This only gets called in advanced mode in order to fill the fancy math options for specific fitting forms.
     *
     * Returns a promise once all data is loaded.
     */
    var broadcastPredictiveDifficulty = function(autoAcceptFlag) {
      // We get the data first, then broadcast to each of the required channels listed below.
      // broadcastChannels =  predictiveDifficultyAValue,predictiveDifficultyBValue,predictiveDifficultyCValue,

      $rootScope.$broadcast('predictiveDifficultyAValue', { loading: true});
      $rootScope.$broadcast('predictiveDifficultyBValue', { loading: true});
      // Only fill C if we are using a quadratic prediction
      if (userInputs.difficultyType === "quadratic"){
        $rootScope.$broadcast('predictiveDifficultyCValue', { loading: true});
      }
      // For the prediction data we need the current block.
      // Make a promise that fills the required data. Return the promise
      return new Promise(function(resolve){
        if (userInputs.currentBlock === undefined) {
        marketDataService.getCurrentBlock(userInputs.cryptocurrency)
          .then(function(result) {
            userInputs.currentBlock = result;
            // Get the prediction Data and calculate the variables
            getPredictionVariables(autoAcceptFlag).then(function(){resolve();});
        })
          .catch(function(err) {
           errorHandlingService.handleError(err);
              $rootScope.$broadcast('predictiveDifficultyAValue', { empty: true});
              $rootScope.$broadcast('predictiveDifficultyBValue', { empty: true});
              $rootScope.$broadcast('predictiveDifficultyCValue', { empty: true});
              reject();
          });
        }
        else { // We already know the current block Number
          // Get the prediction Data and calculate the variables
          getPredictionVariables(autoAcceptFlag).then(function(){resolve();})
          .catch(function() {
           errorHandlingService.handleError(err);
              $rootScope.$broadcast('predictiveDifficultyAValue', { empty: true});
              $rootScope.$broadcast('predictiveDifficultyBValue', { empty: true});
              $rootScope.$broadcast('predictiveDifficultyCValue', { empty: true});
              reject();
          });
        }
      });
    };

    /**
     * Register an input to the forecaster from a user. Typically called from a directive.
     *
     * @param type String labelling the input
     * @param value Object representing the value added by the user
     */
    factory.registerUserInput = function(type, value) {
      userInputs[type] = value;
      $location.search(type, value);

      // If we are using a random crypto currency. Set advanced settings and turn off difficulty prediction.
      if (type === 'cryptocurrency' && value === 'other') {
        userInputs.complexityType='advanced';
        $rootScope.$broadcast("difficultyType", { value: "none", "autoAccept": true});
      }

      if (type === 'complexityType' ) { broadcastComplexityType(value); }

      if(type === 'hashRate') {  broadcastCurrencyRates(); }

      // If we are in the advanced mode, we need to estimate the predictive difficulty values for the user to accept.
      if (userInputs['complexityType'] === 'advanced' && userInputs['difficultyType'] !== 'none' && userInputs['difficultyType'] !== 'auto' && type === "blockTime") { broadcastPredictiveDifficulty(false);}

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

    factory.getList = function(list) {
      if (lists[list] === undefined) return {};
      return lists[list];
    };

    factory.getListItemTitle = function(list, code) {
      if (lists[list] === undefined) { return ''; }
      var found = _.find(lists[list], function(item) {
        return item.code === code;
      });
      if (found === undefined) { return ''; }
      return found.title;
    }

    /**
     * Generate plots & results
     */
    factory.calculate = function() {
      var results = {};

      //TODO: Paul to implement results of validation
      var invalidObjects = validationService.validateCalculate(userInputs);
      console.log(invalidObjects);


      return new Promise(function(resolve){

      // Get Prediction Variables if we need to;
      if (userInputs.cryptocurrency === "eth" && userInputs.difficultyType != 'none' && (userInputs.complexityType != 'advanced' || userInputs.difficultyType == 'auto')){ // Then we need to find prediction variables
        broadcastPredictiveDifficulty(true)
          .then(function(){
            userInputs.predictionVariables = {}
            userInputs.predictionVariables.a = userInputs.predictiveDifficultyAValue;
            userInputs.predictionVariables.b = userInputs.predictiveDifficultyBValue;
            if (userInputs.difficultyType == 'quadratic'){
            userInputs.predictionVariables.c = userInputs.predictiveDifficultyCValue;
            };
            try {
              results = calcService.calculate(userInputs, true) //Predictive
            }
            catch(err){
              errorHandlingService.handleError(err);
            }

            resolve(results);
      })
        .catch(function(err){ //Handle Errors
           errorHandlingService.handleError(err);
        });

      } else { // We don't need to find prediction variables
            userInputs.predictionVariables = {}
            userInputs.predictionVariables.a = userInputs.predictiveDifficultyAValue;
            userInputs.predictionVariables.b = userInputs.predictiveDifficultyBValue;
            if (userInputs.difficultyType == 'quadratic'){
            userInputs.predictionVariables.c = userInputs.predictiveDifficultyCValue;
            };

            try{
              if (userInputs.difficultyType != 'none' ) {results = calcService.calculate(userInputs, true)} //Predictive
              else{results = calcService.calculate(userInputs, false)}; // Not Predictive
              resolve(results);
            }
            catch(err){
              errorHandlingService.handleError(err);
            }


        };

      });
    };


  return factory;

  }]);
