angular.module('ethMiningCalc')
  .controller('ForecasterPlotLengthController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
   
   var componentId = 'plotLength';
   
    var set = function(value) {
      $scope.hasBeenSelected = true;
      $scope.minimised = true;
      $scope.selected = value;
      forecasterService.registerUserInput(componentId, value);
    };
    
    var toggleMinimised = function() {
      $scope.minimised = !$scope.minimised;
    }
    
    var isSelected = function(value) {
      return $scope.selected === value;
    } 
    
    $scope.$on(componentId, function(event, data) { 
      if(data.loading) { return $scope.loading = true; }
      if(data.value) { 
        $scope.value = data.value;
        $scope.loading = false; 
      }
      $scope.$apply();
    });
    
    // Scope
    $scope.value = 100;
    //
    $scope.minimised = false;
    $scope.toggleMinimised = toggleMinimised;
    $scope.hasBeenSelected = false;
    $scope.selected = undefined;
    $scope.isSelected = isSelected;
    $scope.loading = false;
    $scope.set = set;
  }]);
