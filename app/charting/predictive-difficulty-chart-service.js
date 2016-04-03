angular.module('ethMiningCalc')
  .factory('PredictiveDifficultyChartService', [function() {
    var factory = {};

    // Functions for Drawing Plots
    // data requires data.predictedDiffData and data.actualDiffData
    factory.generate = function(id,data) {
      $(id).highcharts({
        chart: {
          zoomType: 'x'
        },
				title: {
          text: "Predicted Difficulty",
          x: -20
        },
        xAxis: {title: { text:  "Days"} },
        yAxis: {
          title: { text: "Difficulty"},
          endOnTick: false,
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
        },
        tooltip:{
          headerFormat: "<b>{series.name}: {point.y:.2f}TH </b><br>",
          pointFormat: "Days: {point.x: .2f}"
        },
        legend: {
          enabled: true
        },
        credits: {
          enabled: false
        },
        series: [{
          name: "Actual Difficulty",
          type: "scatter",
          color: 'rgba(223, 83, 83, .5)',
          radius: 5,
          data: data.actualDiffData
        },{
          name: "Predicted Difficulty",
          marker: { enabled: false },
          data: data.predictedDiffData
        }],
        func: function (chart) {
          $timeout(function () {
            chart.reflow();
          }, 0);
        }
      });
    }

    return factory;
  }]);
