angular.module('ethMiningCalc')
  .controller('ForecasterDifficultyTypeController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
   
   var items = {
      fixed: {
        title: "None",
        code: 'none',
        form: ""
      },
      automatic: {
        title: "Automatic (Find Best Fit)",
        code: 'auto',
        form: ""
      },
      linear: {
        title: "Linear",
        code: 'linear',
        form: "D = a*B + b"
      },
      quadratic: {
        title: "Quadratic",
        code: 'quadratic',
        form: "D= a*B^2 + b*B + c"
      },
      exponential: {
        title: "Exponential",
        code: 'exponential',
        form: "D = Aexp(bx)"
      }
    };
    
    var set = function(value) {
      $scope.hasBeenSelected = true;
      $scope.minimised = true;
      $scope.selected = value;
      forecasterService.registerUserInput('difficultyType', value);
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
