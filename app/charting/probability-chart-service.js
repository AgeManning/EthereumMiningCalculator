angular.module('ethMiningCalc')
  .factory('ProbabilityChartService', [function() {
    var factory = {};

    // Functions for Drawing Plots
    factory.generate = function(id,title,data,xtitle,ytitle,toolTipHeader,toolTipFormat) {
      $(id).highcharts({
        chart: {
          zoomType: 'x'
        },
				title: {
          text: title,
          x: -20
        },
        xAxis: {title: { text:  xtitle} },
        yAxis: {
          title: { text: ytitle },
          max: 105,
          endOnTick: false,
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
        },
        tooltip:{
          headerFormat: toolTipHeader,
          pointFormat: toolTipFormat 
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [{
          name: ytitle,
          marker: { enabled: false },
          data: data
        }]
      });
    }

    return factory;
  }]);