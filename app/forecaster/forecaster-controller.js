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
       if(inputs.cryptocurrency.code !== 'eth') { return false; }
       return true;
     })();
     
     isVisible.difficultyValue = (function() {
       if(inputs.difficultyType === undefined) { return false; }
       if(inputs.difficultyType.code !== 'none') { return false; }
       return true;
     })();
     
   });
    
    $scope.logInputs = function() {
      console.log(forecasterService.getUserInputs());
    }
    
    
    $scope.inputs = forecasterService.inputs;
    $scope.isVisible = isVisible;
  }]);
