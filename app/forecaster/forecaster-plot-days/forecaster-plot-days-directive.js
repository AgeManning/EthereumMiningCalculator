angular.module('ethMiningCalc')
  .directive('forecasterPlotDays', function() {
    return {
        restrict: 'AE',
        controller: 'ForecasterPlotDaysController',
        templateUrl: 'app/forecaster/forecaster-plot-days/forecaster-plot-days.html',
        scope: {}
    };
  });