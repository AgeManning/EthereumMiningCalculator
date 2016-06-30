angular.module('ethMiningCalc')
  .factory('ForecasterService', ['$rootScope', '$location', '$window', '$timeout', 'MarketDataService', 'DataPredictionService','PredictionService', 'ForecasterCalcAdapterService', 'CalcService', function($rootScope, $location, $window, $timeout, marketDataService, dataPredictionService, predictionService,forecasterCalcAdapterService,calcService) {
    var factory = {};
    var userInputs = $location.search();

    
    /**
     * Reset all user inputs and start again with a fresh calc
     */
    factory.resetInputs = function() {
      $location.url($location.path());
      $window.location.reload();
    }

    // Going to put defaults here
    var defaultCurrency = "AUD";

    //var userInputs = {};

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
          code: 'eth',
          crypto_Block: 5
        },
        btc: {
          title: "Bitcoin (BTC)",
          code: 'btc',
          crypto_Block: 25 //May need to pull this data. It changes in July 2016
        },
        other: {
          title: "Other",
          code: 'other',
          crypto_Block: 0
        }
      },
      "complexityType": {
        def: {
          title: "Basic (Automaticly choose options)",
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
          $rootScope.$broadcast("difficultyType", { value: "none", "autoAccept": true});
          if (userInputs.cryptoPrice === undefined){ //Only run these broadcasts if we need to
            broadcastCurrencyRates(true);
          }
          if (userInputs.currentHashRate === undefined){
            broadcastDifficultyValue(true);
          }
          if (userInputs.blockTime === undefined){
            broadcastBlockTime(true);
          }
          $rootScope.$broadcast("blockReward", { value: lists.cryptocurrency[userInputs.cryptocurrency].crypto_Block, "autoAccept": true});
          $rootScope.$broadcast("minerExpenseInclusion", { value: "disable", "autoAccept": true});
          $rootScope.$broadcast("plotResolution", { value: 100, "autoAccept": true});
          break;


         case "custom":
          $rootScope.$broadcast("difficultyType", { value: "auto", "autoAccept": true});
          if (userInputs.cryptoPrice === undefined){ //Only run these broadcasts if we need to
            broadcastCurrencyRates(false);
          };
          if (userInputs.currentDifficulty === undefined){ //Only run these broadcasts if we need to
            broadcastDifficultyValue(false); 
          };
          if (userInputs.blockTime === undefined){
            broadcastBlockTime(false);
          };
          $rootScope.$broadcast("plotResolution", { value: 100, "autoAccept": true});

          return true;
          break;
         case "advanced":
          if (userInputs.cryptoPrice === undefined){ //Only run these broadcasts if we need to
            broadcastCurrencyRates(false);
          }
          if (userInputs.currentDifficulty === undefined){ //Only run these broadcasts if we need to
            broadcastDifficultyValue(false); 
          };
          if (userInputs.blockTime === undefined){
            broadcastBlockTime(false);
          }
          return true;
          break;

      };
    }


    var broadcastCurrencyRates = function(autoAcceptFlag) {
      var broadcastChannel = 'cryptoPrice';
      var loadingParam = {"loading": true}; // Send this to put into loading state
      // If we auto accept, bypass loading state and just leave "Loading..." as value
      if (autoAcceptFlag){
        loadingParam = {value: "Loading...", autoAccept: true};
      }
      $rootScope.$broadcast(broadcastChannel, loadingParam);
      marketDataService.getRates(userInputs.cryptocurrency)
        .then(function(list) {
          //If we are auto accepting the currency, use a default currency. 
          var cryptoRate = 0;
          if (autoAcceptFlag) {
            // Its a list so need to search for a currency. Set to AUD by default (Hard coded)
            cryptoRate = list[6].rate;
          }
          $rootScope.$broadcast(broadcastChannel, { value: cryptoRate, list: list ,"autoAccept": autoAcceptFlag });
        })
        .catch(function(error) {
          $rootScope.$broadcast(broadcastChannel, { value: 0, list: [] ,"autoAccept": autoAcceptFlag });
        });
    }

    /**
     * Get this item and broadcast it to components
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
        .catch(function() {
          $rootScope.$apply(function() {
            $rootScope.$broadcast(broadcastChannel, { empty: true,"autoAccept": autoAcceptFlag  });
          });
        });
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
        .catch(function() {
          $rootScope.$apply(function() {
            $rootScope.$broadcast(broadcastChannel, { empty: true, "autoAccept": autoAcceptFlag });
          });

        });
    }

    /** 
     * This only gets called in advanced mode in order to fill the fancy math options for specific fitting forms.
     *
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
      // Build a prediction data set
      var inputPredictionData = {};
      inputPredictionData.pastDays = userInputs.predictiveDifficultyPastDays;
      inputPredictionData.blockTime = userInputs.blockTime;
      // predictionData.curBlock =  // Need to get 
      inputPredictionData.curDifficulty = userInputs.currentDifficulty; //This takes difficulty and is measured in TH/s
      inputPredictionData.noPoints = userInputs.predictiveDifficultyPastDays;
    
      // For the prediction data we need the current block. 
      //TODO: Find better logic to solve this problem

      // Make a promise that fills the required data. Return the promise
      return new Promise(function(resolve){ 

        if (userInputs.currentBlock === undefined) {
        marketDataService.getCurrentBlock(userInputs.cryptocurrency)
          .then(function(result) {
            userInputs.currentBlock = result;
            inputPredictionData.curBlock = userInputs.currentBlock
            // Get the prediction Data and calculate the variables 
            dataPredictionService.getPredictionData(inputPredictionData) // Get the Raw data 
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
          .catch(function(thing) {
            console.log(thing);
          });
          })
          .catch(function(thing) {
            $rootScope.$apply(function() {
              console.log("SomethingFailed).");
              console.log(thing);
              $rootScope.$broadcast('predictiveDifficultyAValue', { empty: true});
              $rootScope.$broadcast('predictiveDifficultyBValue', { empty: true});
              $rootScope.$broadcast('predictiveDifficultyCValue', { empty: true});
              reject();
            });
          });
        } 
        else { // We already know the current block Number
          inputPredictionData.curBlock = userInputs.currentBlock;
          // Get the prediction Data and calculate the variables 
          dataPredictionService.getPredictionData(inputPredictionData) // Get the Raw data 
          .then(function(predictionData){
            userInputs.predictionData = predictionData // We need this data in the cal.
            var predictionVariables = predictionService.predict(userInputs.difficultyType, predictionData) //Return our variables
            $rootScope.$apply(function() {
                if( userInputs.difficultyType == 'auto'){ // We need to change this once it has found the best type
                $rootScope.$broadcast('difficultyType', { value: predictionVariables.type, autoAccept: truea});
                autoAcceptFlag = true;
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
          .catch(function() {
            $rootScope.$apply(function() {
              $rootScope.$broadcast('predictiveDifficultyAValue', { empty: true});
              $rootScope.$broadcast('predictiveDifficultyBValue', { empty: true});
              $rootScope.$broadcast('predictiveDifficultyCValue', { empty: true});
              reject();
            });
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


      if (type === 'complexityType' ) { broadcastComplexityType(value); };
      //if (type === 'currentHashRate') { broadcastBlockTime(false); }
      //if (type === 'costAnalysis' && value === "enable") { broadcastCurrencyRates(false); }

      // If we are in the advanced mode, we need to estimate the predictive difficulty values for the user to accept.
      if (userInputs['complexityType'] === 'advanced' && userInputs['difficultyType'] !== 'none' && userInputs['difficultyType'] !== 'auto' && type === "blockReward") { broadcastPredictiveDifficulty(false);}


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
      
      return new Promise(function(resolve){

      // Get Prediction Variables if we need to; 
      if (userInputs.difficultyType != 'none' && (userInputs.complexityType != 'advanced' || userInputs.difficultyType == 'auto')){ // Then we need to find prediction variables
        broadcastPredictiveDifficulty(true)
          .then(function(){
            userInputs.predictionVariables = {}
            userInputs.predictionVariables.a = userInputs.predictiveDifficultyAValue;
            userInputs.predictionVariables.b = userInputs.predictiveDifficultyBValue;
            console.log(userInputs);
            if (userInputs.difficultyType == 'quadratic'){
            userInputs.predictionVariables.c = userInputs.predictiveDifficultyCValue;
            };

            results = calcService.calculate(userInputs, true) //Predictive
            resolve(results);
      });
      } else { // We don't need to find prediction variables
            userInputs.predictionVariables = {}
            userInputs.predictionVariables.a = userInputs.predictiveDifficultyAValue;
            userInputs.predictionVariables.b = userInputs.predictiveDifficultyBValue;
            if (userInputs.difficultyType == 'quadratic'){
            userInputs.predictionVariables.c = userInputs.predictiveDifficultyCValue;
            };
            
            if (userInputs.difficultyType != 'none' ) {results = calcService.calculate(userInputs, true)} //Predictive
            else{results = calcService.calculate(userInputs, false)}; // Not Predictive
            resolve(results);

        };

      });
    };


  return factory;

  }]);
