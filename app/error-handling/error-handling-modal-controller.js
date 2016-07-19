angular.module('ethMiningCalc')
  .controller('errorHandlingModalController', function ($scope, $uibModalInstance, ErrorHandlingService) {

    $scope.errors = ErrorHandlingService.errors;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});
