angular.module('ethMiningCalc')
  .controller('ForecasterDifficultyTypeController', ['$scope', 'ForecasterService', function($scope, forecasterService) {

    var items = forecasterService.difficultyTypes;
    
    var set = function(value) {
      $scope.hasBeenSelected = true;
      $scope.minimised = true;
      $scope.selected = value;
      forecasterService.registerUserInput('difficultyType', value.code);
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
