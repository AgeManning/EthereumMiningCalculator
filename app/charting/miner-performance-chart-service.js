angular.module('ethMiningCalc')
  .factory('MinerPerformanceChartService', [function() {
    var factory = {};

    // Functions for Drawing Plots
    factory.generate = function(Name,Data) 
    {
      var HighChartsData = {
        chart: {
          zoomType: 'xy',
        },
				title: {
          text: "Miner Performance", 
          x: -20
        },
        xAxis: {title: { text:  "Date"},
            min: Data.minedBlocks[0][0],
            type: 'datetime',
            //Make the graph the width of the data
            max: Data.minedBlocks[Data.minedBlocks.length-1][0]
        },
        yAxis: {
          title: { text: "Solved Blocks"},
          min: 0,
          max: Data.expected.maximumValue,
          endOnTick: false,
          startOnTick: false,
          },
        tooltip:{
        },
        legend: {
          enabled: true

        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: { stickyTracking: false }
        },
        series: [
       {
          name: "1 \u03C3",
          type: "arearange",
          data: Data.expected.oneSigmaRange,
          color: 'green',
          lineWidth: 0,
          marker: { enabled: false },
          tooltip: {
            shared: false,
            headerFormat: "<b>64.2%</b> of the time will be here<br>",
            pointFormat: "<b>Day:</b> {point.x:%e. %b} <b>Range:</b> {point.low:0.2f} - {point.high:0.2f}"
          },
          fillOpacity: 0.3
        },{
          name: "1-2 \u03C3",
          type: "arearange",
          data: Data.expected.twoSigmaUpper,
          color: "#ffff66",
          lineWidth: 0,
          marker: { enabled: false },
          tooltip: {
            shared: false,
            headerFormat: "<b>13.6%</b> of the time will be here<br>",
            pointFormat: "<b>Day:</b> {point.x:%e. %b} <b>Range:</b> {point.low:0.2f} - {point.high:0.2f}"
          },
          fillOpacity: 0.3
        },{
          name: "Std Lower",
          type: "arearange",
          data: Data.expected.twoSigmaLower,
          color: "#ffff66",
          marker: { enabled: false },
          fillOpacity: 0.3,
          showInLegend: false,
          tooltip: {
            shared: false,
            headerFormat: "<b>13.6%</b> of the time will be here<br>",
            pointFormat: "<b>Day:</b> {point.x:%e. %b} <b>Range:</b> {point.low:0.2f} - {point.high:0.2f}"
          },
          lineWidth: 0
        },{ 
          name: "> 2\u03C3",
          type: "arearange",
          data: Data.expected.maximumPlotValue,
          marker: { enabled: false },
          color: "red",
          fillOpacity: 0.3,
          showInLegend: true,
          tooltip: {
            shared: false,
            headerFormat: "<b>2.1%</b> of the time will be here<br>",
            pointFormat: "<b>Day:</b> {point.x:%e. %b} <b>Range:</b> {point.low:0.2f} -  \u221E"
          },
          lineWidth: 0
        },{ 
          name: "Min Plot Value",
          type: "arearange",
          data: Data.expected.minimumPlotValue,
          marker: { enabled: false },
          color: "red",
          fillOpacity: 0.3,
          showInLegend: false,
          tooltip: {
            shared: false,
            headerFormat: "<b>2.1%</b> of the time will be here<br>",
            pointFormat: "<b>Day:</b> {point.x:%e. %b} <b>Range:</b> {point.low:0.2f} - {point.high:0.2f}"
          },
          lineWidth: 0
        },{ 
          name: "Average",
          type: 'spline',
          lineWidth: 2,
          marker: { enabled: false },
          data: Data.expected.expected,
          tooltip: {
            shared: false,
            headerFormat: "<b>Expected Blocks (Average)</b><br>",
            pointFormat: "<b>Day:</b> {point.x:%e. %b} <b>Expected:</b> {point.y:0.2f}"
          },
          color: "green"
        },{ 
          name: "Actual Solved Blocks",
          type: "spline",
          lineWidth: 4,
          data: Data.minedBlocks,
          marker: { enabled: true},
          // color: '#7cb5ec',
          color: '#4A9BE8',
          showInLegend: true,
          tooltip: {
            shared: false,
            headerFormat: "<b>Actual Mined Blocks</b><br>",
            pointFormat: "<b>Date:</b> {point.x:%e. %b} <b>Block Count:</b> {point.y}"
          }
        }],
        func: function (chart) {
          $timeout(function () {
            chart.reflow();
          }, 0);
        }
       }
			$(Name).highcharts(HighChartsData);
    }

    return factory;
  }]);
