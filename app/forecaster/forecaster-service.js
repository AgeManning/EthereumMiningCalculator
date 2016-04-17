angular.module('ethMiningCalc')
  .factory('ForecasterService', ['$rootScope', 'MarketDataService', function($rootScope, marketDataService) {
    var factory = {};
    var userInputs = {};
    
    

    /**
     * Get this item and broadcast it to components
     */
    var broadcastDifficultyValue = function() {
      var broadcastChannel = 'difficultyValue'
      $rootScope.$broadcast(broadcastChannel, { "loading": true });
      marketDataService.getDifficulty(userInputs.cryptocurrency.code)
        .then(function(difficulty) {
          $rootScope.$broadcast(broadcastChannel, { "value": difficulty });
        })
        .catch(function() {
          $rootScope.$broadcast(broadcastChannel, { empty: true });
        });
    }

    /**
     * Get this item and broadcast it to components
     */
    var broadcastBlockTime = function() {
      var broadcastChannel = 'blockTime'
      $rootScope.$broadcast(broadcastChannel, { "loading": true });
      marketDataService.blockTime(userInputs.cryptocurrency.code)
        .then(function(difficulty) {
          $rootScope.$broadcast(broadcastChannel, { "value": difficulty });
        })
        .catch(function() {
          $rootScope.$broadcast(broadcastChannel, { empty: true });
        });
    }

    /**
     * Register an input to the forecaster from a user. Typically called from a directive.
     * 
     * @param type String labelling the input
     * @param value Object representing the value added by the user
     */
    factory.registerUserInput = function(type, value) {
      userInputs[type] = value;

      if (type === 'difficultyType' && userInputs['difficultyType'].code === 'none') { broadcastDifficultyValue(); };
      if (type === 'difficultyValue') { broadcastBlockTime(); }

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
    
    factory.calculate = function() {
      console.log('calculate');
    };

    return factory;
  }]);