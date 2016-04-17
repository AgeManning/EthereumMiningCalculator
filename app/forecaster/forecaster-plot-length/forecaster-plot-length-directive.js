angular.module('ethMiningCalc')
  .directive('forecasterPlotLength', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterPlotLengthController',
        templateUrl: 'app/forecaster/forecaster-plot-length/forecaster-plot-length.html',
        scope: {}
    };
  });