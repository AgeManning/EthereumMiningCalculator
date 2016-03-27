angular.module('ethMiningCalc')
  .factory('VarianceChartService', [function() {
    var factory = {};

    // Functions for Drawing Plots
    factory.generate = function(Name,Data,stdData,std2UpperData,std2LowerData,maxPlotValue,minPlotValue) 
    {
			$(Name).highcharts({
        chart: {
          zoomType: 'xy',
        },
				title: {
          text: "Expected Solved Blocks with Variance",
          x: -20
        },
        xAxis: {title: { text:  "Days"},
            min:0,
            //Make the graph the width of the data
            max: Data[Data.length-1][0]
        },
        yAxis: {
          title: { text: "Solved Blocks"},
          min: 0,
          max: maxPlotValue[1][2],
          endOnTick: false,
          plotLines: [{
            color: 'black',
            width: 1,
            dashStyle: "Solid",
            label: {
              align: "right",
              text: "1 Block\u00A0\u00A0\u00A0\u00A0",
              style: {
                fontWeight: "bold"
              }
            },
            value: 1
          }],
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
          name: "1 Sigma",
          type: "arearange",
          data: stdData,
          color: 'green',
          lineWidth: 0,
          marker: { enabled: false },
          tooltip: {
            shared: false,
            headerFormat: "<b>64.2%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:,0.2f} Range: {point.low:0.2f} - {point.high:0.2f}"
          },
          fillOpacity: 0.3
        },{
          name: "1-2 \u03C3",
          type: "arearange",
          data: std2UpperData,
          color: "#ffff66",
          lineWidth: 0,
          marker: { enabled: false },
          tooltip: {
            shared: false,
            headerFormat: "<b>13.6%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:,0.2f} Range: {point.low:0.2f} - {point.high:0.2f}"
          },
          fillOpacity: 0.3
        },{
          name: "Std Lower",
          type: "arearange",
          data: std2LowerData,
          color: "#ffff66",
          marker: { enabled: false },
          fillOpacity: 0.3,
          showInLegend: false,
          tooltip: {
            shared: false,
            headerFormat: "<b>13.6%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:,0.2f} Range: {point.low:0.2f} - {point.high:0.2f}"
          },
          lineWidth: 0
        },{ 
          name: "> 2\u03C3",
          type: "arearange",
          data: maxPlotValue,
          marker: { enabled: false },
          color: "red",
          fillOpacity: 0.3,
          showInLegend: true,
          tooltip: {
            shared: false,
            headerFormat: "<b>2.1%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:,0.2f} Range: {point.low:0.2f} -  \u221E"
          },
          lineWidth: 0
        },{ 
          name: "Min Plot Value",
          type: "arearange",
          data: minPlotValue,
          marker: { enabled: false },
          color: "red",
          fillOpacity: 0.3,
          showInLegend: false,
          tooltip: {
            shared: false,
            headerFormat: "<b>2.1%</b> of the time will be here<br>",
            pointFormat: "Day: {point.x:0.2f} Range: {point.low:0.2f} - {point.high:0.2f}"
          },
          lineWidth: 0
        },{ 
          name: "Average",
          type: 'spline',
          lineWidth: 2,
          marker: { enabled: false },
          data: Data,
          tooltip: {
            shared: false,
            headerFormat: "<b>Expected Blocks (Average)</b><br>",
            pointFormat: "Day: {point.x:0.2f} Expected: {point.y:0.2f}"
          },
          color: "green"
        }]
      });
    }

    return factory;
  }]);