angular.module('ethMiningCalc')
  .controller('ForecasterDifficultyValueController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
   
   var items = {
      fixed: {
        title: "None",
        form: ""
      },
      automatic: {
        title: "Automatic (Find Best Fit)",
        form: ""
      },
      linear: {
        title: "Linear",
        form: "D = a*B + b"
      },
      quadratic: {
        title: "Quadratic",
        form: "D= a*B^2 + b*B + c"
      },
      exponential: {
        title: "Exponential",
        form: "D = Aexp(bx)"
      }
    };
    
    var set = function(value) {
      $scope.hasBeenSelected = true;
      $scope.minimised = true;
      $scope.selected = value;
      forecasterService.registerUserInput('difficultyValue', value);
    };
    
    var toggleMinimised = function() {
      $scope.minimised = !$scope.minimised;
    }
    
    var isSelected = function(value) {
      return $scope.selected === value;
    } 
    
    // Scope
    $scope.minimised = false;
    $scope.toggleMinimised = toggleMinimised;
    $scope.hasBeenSelected = false;
    $scope.selected = undefined;
    $scope.isSelected = isSelected;
    $scope.items = items; 
    $scope.set = set;
  }]);
