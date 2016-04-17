angular.module('ethMiningCalc')
  .controller('ForecasterController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
   
    var isVisible = {
      cryptocurrency: true
    }
    
   /*
   *  This function is run whenever the ForecasterService has a userInputs update
   */
   $scope.$on('userInputs-updated', function() {
     var inputs = forecasterService.getUserInputs();
     
     // Note: these (function() { })() things are called Immediately-Invoked Function Expressions.
     // It's an anonymous function that runs immediately.
     
     isVisible.difficultyType = (function() {
       if(inputs.cryptocurrency === undefined) { return false; }
       if(inputs.cryptocurrency !== 'eth') { return false; }
       return true;
     })();
     
     isVisible.difficultyValue = (function() {
       if(inputs.cryptocurrency !== 'eth') { return true; }
       if(inputs.difficultyType === undefined) { return false; }
       if(inputs.difficultyType !== 'none') { return false; }
       return true;
     })();
     
     isVisible.blockTime = (function() {
       if(inputs.difficultyValue !== undefined) { return true; } 
       return false;
     })();
     
     isVisible.plotDays = (function() {
       if(inputs.blockTime !== undefined) { return true; } 
       return false;
     })();
     
     isVisible.plotLength = (function() {
       if(inputs.plotDays !== undefined) { return true; } 
       return false;
     })();
     
     isVisible.calculate = (function() {
       if(inputs.plotLength !== undefined) { return true; } 
       return false;
     })();
     
     
     
   });
    
    $scope.logInputs = function() {
      console.log(forecasterService.getUserInputs());
    }
    
    
    //$scope.inputs = forecasterService.inputs;
    $scope.calculate = forecasterService.calculate;
    $scope.isVisible = isVisible;
  }]);
