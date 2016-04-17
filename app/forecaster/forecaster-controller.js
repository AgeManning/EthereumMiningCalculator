angular.module('ethMiningCalc')
  .controller('ForecasterController', ['$scope', '$timeout', 'ForecasterService', function($scope, $timeout, forecasterService) {

    var isVisible = {
      cryptocurrency: true
    }

    var updateVisibilities = function() {
      inputs = forecasterService.getUserInputs();

      isVisible.cryptocurrency = true;

      isVisible.difficultyType = (function() {
        if (inputs.cryptocurrency === undefined) { return false; }
        if (inputs.cryptocurrency !== 'eth') { return false; }
        return true;
      })();

      isVisible.predictiveDifficultyPointCount = (function() {
        if (inputs.difficultyType === 'none') { return false; }
        if (inputs.difficultyType === undefined) { return false; }
        if (inputs.cryptocurrency !== undefined) { return true; }
        return false;
      })();

      isVisible.predictiveDifficultyPastDays = (function() {
        if (inputs.difficultyType === 'none') { return false; }
        if (inputs.difficultyType === undefined) { return false; }
        if (inputs.predictiveDifficultyPointCount !== undefined) { return true; }
        return false;
      })();

      isVisible.predictiveDifficultyAValue = (function() {
        if (inputs.difficultyType === 'none') { return false; }
        if (inputs.difficultyType === undefined) { return false; }
        if (inputs.predictiveDifficultyPastDays !== undefined) { return true; }
        return false;
      })();

      isVisible.predictiveDifficultyBValue = (function() {
        if (inputs.difficultyType === 'none') { return false; }
        if (inputs.difficultyType === undefined) { return false; }
        if (inputs.predictiveDifficultyAValue !== undefined) { return true; }
        return false;
      })();

      isVisible.predictiveDifficultyCValue = (function() {
        if (inputs.difficultyType !== 'quadratic') { return false; }
        if (inputs.predictiveDifficultyBValue !== undefined) { return true; }
        return false;
      })();

      isVisible.difficultyValue = (function() {
        if (inputs.cryptocurrency === undefined) { return false; }
        if (inputs.cryptocurrency !== 'eth') { return true; }
        if (inputs.difficultyType === 'none') { return true; }
        return false;
      })();

      isVisible.blockTime = (function() {
        if (inputs.difficultyType !== "none") { return false; }
        if (inputs.difficultyValue !== undefined) { return true; }
        return false;
      })();

      isVisible.costAnalysis = (function() {
        if (inputs.blockTime !== undefined) { return true; }
        if (inputs.difficultyType !== "quadratic" && inputs.predictiveDifficultyBValue !== undefined) { return true; }
        if (inputs.predictiveDifficultyCValue !== undefined) { return true; }
        return false;
      })();

      isVisible.costAnalysisRate = (function() {
        if (inputs.costAnalysis === "enable") { return true; }
        return false;
      })();

      isVisible.blockReward = (function() {
        if (inputs.costAnalysis === "enable" && inputs.costAnalysisRate !== undefined) { return true; }
        return false;
      })();

      isVisible.initialInvestment = (function() {
        if (inputs.costAnalysis === "enable" && inputs.blockReward !== undefined) { return true; }
        return false;
      })();

      isVisible.electricityUsage = (function() {
        if (inputs.costAnalysis === "enable" && inputs.initialInvestment !== undefined) { return true; }
        return false;
      })();

      isVisible.electricityRate = (function() {
        if (inputs.costAnalysis === "enable" && inputs.electricityUsage !== undefined) { return true; }
        return false;
      })();

      isVisible.plotDays = (function() {
        if (inputs.costAnalysis === "disable") { return true; }
        if (inputs.costAnalysis === "enable" && inputs.electricityRate !== undefined) { return true; }
        return false;
      })();

      isVisible.plotLength = (function() {
        if (inputs.plotDays !== undefined) { return true; }
        return false;
      })();

      isVisible.calculate = (function() {
        if (inputs.plotLength !== undefined) { return true; }
        return false;
      })();

    }

    var inputs = forecasterService.getUserInputs();
    updateVisibilities();

    $scope.$on('userInputs-updated', updateVisibilities);

    $scope.logInputs = function() {
      console.log(forecasterService.getUserInputs());
    }


    //$scope.inputs = forecasterService.inputs;
    $scope.calculate = forecasterService.calculate;
    $scope.isVisible = isVisible;
  }]);
