angular.module('ethMiningCalc')
  .controller('ForecasterCryptocurrencyTypeController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
    
    var items = forecasterService.cryptocurrencies;
    
    var set = function(value) {
      $scope.hasBeenSelected = true;
      $scope.minimised = true;
      $scope.selected = value;
      forecasterService.registerUserInput('cryptocurrency', value.code);
    };
    
    var toggleMinimised = function() {
      $scope.minimised = !$scope.minimised;
    }
    
    var isSelected = function(value) {
      return $scope.selected === value;
    } 
    
    // Scope
    $scope.toggleMinimised = toggleMinimised;
    $scope.minimised = false;
    $scope.hasBeenSelected = false;
    $scope.selected = undefined;
    $scope.isSelected = isSelected;
    $scope.items = items; 
    $scope.set = set;
  }]);
