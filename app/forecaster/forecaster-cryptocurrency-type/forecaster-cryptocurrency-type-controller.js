angular.module('ethMiningCalc')
  .controller('ForecasterCryptocurrencyTypeController', ['$scope', 'ForecasterService', function($scope, forecasterService) {
   
   var items = {
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
    };
    
    var set = function(value) {
      $scope.hasBeenSelected = true;
      $scope.minimised = true;
      $scope.selected = value;
      forecasterService.registerUserInput('cryptocurrency', value);
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
