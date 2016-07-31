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
        subtitle: {
          text: 'Click and drag to zoom',
          x: -20
        },
        xAxis: {title: { text:  "Date"},
            min: Data.minedBlocks[0][0],
            type: 'datetime',
            dateTimeLabelFormats: { 
            week: '%e. %b %y'
            },
            //Make the graph the width of the data
            max: Data.minedBlocks[Data.minedBlocks.length-1][0]
        },
        yAxis: {
          title: { text: "Solved Blocks"},
          min: 1,
          max: Math.max(Data.expected.maximumValue,Data.minedBlocks[Data.minedBlocks.length-1][1]*1.1),
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
   
      //If we are plotting up to today. Don't limit the chart, add a dotted line showing potential.
      if (Data.currentlyMining === 'enable')
      {
        //Get Data for potential line. i.e Extend Mined Blocks
        var newPointData = [[Data.minedBlocks[Data.minedBlocks.length-1][0],Data.minedBlocks[Data.minedBlocks.length-1][1]],[Data.expected.expected[Data.expected.expected.length-1][0],Data.minedBlocks[Data.minedBlocks.length-1][1]+1]];
        // Limit the graph to the new width
        HighChartsData.xAxis.max = Data.expected.expected[Data.expected.expected.length-1][0];
        HighChartsData.yAxis.max = Math.max(Data.expected.maximumValue,(Data.minedBlocks[Data.minedBlocks.length-1][1]+1)*1.1), //If we add one more potential block, make sure it fits in the graph with a 10% margin
        //Make a fake line. 
        HighChartsData.series.push({
          name: "If a block was solved now",
          type: "spline",
          dashStyle: "dash",
          lineWidth: 3,
          data: newPointData,
          marker: { enabled: true},
          // color: '#7cb5ec',
          color: '#4A9BE8',
          showInLegend: true,
          tooltip: {
            shared: false,
            headerFormat: "<b>If a block was mined now</b><br>",
            pointFormat: "<b>Date:</b> {point.x:%e. %b} <b>Block Count:</b> {point.y}"
          }
        });
      }

			$(Name).highcharts(HighChartsData);
    }

    return factory;
  }]);
