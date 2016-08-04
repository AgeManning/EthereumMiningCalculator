angular.module('ethMiningCalc')
  .factory('ValidationService', [function() {
    var factory = {};
   
  /*  Validation Service
   *  Handles the validation of both forecaster and miner-performance
   *
   *  The following validate functions return a list of strings. The strings are the names of the components which are invalid.
   *
   *  validateCalculate : Validates the forecaster components when the calculate button has been pressed. 
   *  validateAnalyse   : Validates the miner-performance components when the analyse button has been pressed.
   *
   *  Assumes userInputs can contain the following
   *
   *  cryptocurrency                  : crypto currency type. eg 'eth'
   *  complexityType                  : complexity, eg 'default'
   *  hashRate                        : hashRate
   *  difficultyType                  : difficulty type eg 'auto'
   *  predictiveDifficultyPastDays    : days to predict
   *  predictiveDifficultyPointCount  : number of points to sample
   *  cryptoPrice                     : price
   *  currentDifficulty               : current difficulty
   *  blockTime                       : block time
   *  blockReward                     : block reward
   *  predictiveDifficultyAValue      : a coefficient
   *  predictiveDifficultyBValue      : b coefficient
   *  predictiveDifficultyCValue      : c coefficient
   *  minerExpenseInclusion           : enable or disable
   *  initialInvestment               : initial investment
   *  electricityUsage                : usage
   *  electricityRate                 : electricty rate
   *  plotDays                        : days to plot over
   *  plotResolution                  : number of points in plot
   *
   *  minerAddress                    : ethereum mining address
   *  pastBlocks                      : past blocks to check miner over
   *
   *
   */   
   
  // Validate forecaster inputs
  factory.validateCalculate = function(userInputs){
    var invalidObjects = []; // List of string of invalid objects.

    // Common Validations for all Currencies
    var CommonPosNumberComponents = ['hashRate','cryptoPrice','blockTime','blockReward','plotDays'];
      for (var i =0; i < CommonPosNumberComponents.length; i++){
        // Check these components are defined and are positive numbers
        if (!validatePosNumber(userInputs[CommonPosNumberComponents[i]]))
          invalidObjects.push(CommonPosNumberComponents[i]);
      };
      
      // Current Difficulty Doesn't need to be defined for ETH with predictive difficulty. 

      // Seperate, not just positive number, also >= 2
      if (!validatePointCount(userInputs.plotResolution))
        invalidObjects.push('plotResolution');
    // Currency specific validations
    switch(userInputs.cryptocurrency){

      case 'eth': //Eth Specific Validations
        // Complexity Doesn't Matter

        if (userInputs.difficultyType === undefined){
          invalidObjects.push('difficultyType');
          break; // No point throwing future errors.
        }
       
        // Current Difficulty
        if (userInputs.difficultyType === 'none'){
          if (!validatePosNumber(userInputs.currentDifficulty))
            invalidObjects.push('currentDifficulty');
        };
        
        // Different validate predictive difficulty options if we need to
        if (userInputs.difficultyType !== 'none'){
          if (!validatePosNumber(userInputs.predictiveDifficultyPastDays))
            invalidObjects.push('predictiveDifficultyPastDays');
          if (!validatePointCount(userInputs.predictiveDifficultyPointCount))
            invalidObjects.push('predictiveDifficultyPointCount');
        };
         
        // Predictive Difficulty Advanced Complexity, we need A,B,C Coefficients.
        if (userInputs.difficultyType !== 'none' && userInputs.difficultyType !== 'auto' && userInputs.complexityType === 'advanced'){
          if (!validateNumber(userInputs.predictiveDifficultyAValue))
            invalidObjects.push('predictiveDifficultyAValue');

          if (!validateNumber(userInputs.predictiveDifficultyBValue))
            invalidObjects.push('predictiveDifficultyBValue');

          if (userInputs.difficultyType === 'quadratic'){
            if (!validateNumber(userInputs.predictiveDifficultyCValue))
              invalidObjects.push('predictiveDifficultyCValue');
          };

        };

        break;
       
      case 'btc':
          // BTC Specific Validation
          if (!validatePosNumber(userInputs.currentDifficulty))
            invalidObjects.push('currentDifficulty');
        break;

      case 'other':
          // Other Specific Validation
          if (!validatePosNumber(userInputs.currentDifficulty))
            invalidObjects.push('currentDifficulty');
        break;

      default:
        invalidObjects.push('cryptocurrency');
        break;

    };

    // Cost Validation
    if (userInputs.minerExpenseInclusion === undefined)
      invalidObjects.push('minerExpenseInclusion');
    else{
      if (userInputs.minerExpenseInclusion === 'enable'){
        var CostPosNumberComponents = ['initialInvestment','electricityUsage','electricityRate'];
          for (var i =0; i < CostPosNumberComponents.length; i++){
            // Check these components are defined and are positive numbers. Can be zero
            if (!validatePosZeroNumber(userInputs[CostPosNumberComponents[i]]))
              invalidObjects.push(CostPosNumberComponents[i]);
          };
      };
    };

    return invalidObjects;

  };

  factory.validateAnalyse = function(userInputs){
    var invalidObjects = [];
    // This is simple, we need all three inputs. 
    if (!validatePosNumber(userInputs.hashRate))
        invalidObjects.push('hashRate');

    if (!validatePosNumber(userInputs.blockTime))
        invalidObjects.push('blockTime');

    if (!validateMinerAddress(userInputs.minerAddress))
        invalidObjects.push('minerAddress');


    if (typeof userInputs.pastBlocks !== 'number' || userInputs.pastBlocks < 0)
        invalidObjects.push('pastBlocks');

    return invalidObjects;

  };


  // Functions to validate each kind of input -- Only that require some kind of non-obvious logic.

  // Generic Validations
  var validatePosNumber = function(number){
    if (typeof number !== 'number' || isNaN(number) || number <= 0)
      return false;
    return true;
  };

  var validateNumber = function(number){
    if (typeof number !== 'number' || isNaN(number))
      return false;
    return true;
  };

  var validatePosZeroNumber = function(number){
    if (typeof number !== 'number' || isNaN(number) || number < 0)
      return false;
    return true;
  };


  // Number of points for graphs or prediction must be >= 2
  var validatePointCount = function(pointCount){
    if (pointCount >= 2 && typeof pointCount  === 'number')
      return true;
    return false;
  };

  // Should already be of length 42, but double check anyway. 
  var validateMinerAddress = function(address){
    if (address.length != 42 || typeof address !== 'string')
      return false;
    //check the last 40 characters are hex
    var re = /[0-9A-Fa-f]{40}/g;
    var hexString = address.slice(-40);
    return (re.test(hexString))

  };


  return factory;
  }]);
