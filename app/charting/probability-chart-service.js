angular.module('ethMiningCalc')
  .factory('ProbabilityChartService', [function() {
    var factory = {};

    // Functions for Drawing Plots
    factory.generate = function(id,data) {
      $(id).highcharts({
        chart: {
          zoomType: 'x'
        },
				title: {
          text: "Probability of Solving at Least One Block",
          x: -20
        },
        subtitle: {
          text: 'Click and drag to zoom',
          x: -20
        },
        xAxis: {title: { text:  "Days"} },
        yAxis: {
          title: { text: "Probability (%)" },
          max: 105,
          endOnTick: false,
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
        },
        tooltip:{
          headerFormat: "<b>{series.name}: {point.y:.2f}% </b><br>",
          pointFormat: "Days: {point.x: .2f}"
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [{
          name: "Probability (%)",
          marker: { enabled: false },
          data: data
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
