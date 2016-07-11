angular.module('ethMiningCalc')
/*
 * Filter to return the plots which are enabled
 *
 **/
  .filter('plotFilter', function() {
    return function(plots) {
      var validPlots = []; 
      angular.forEach(plots, function(plot) {
        if (plot.enabled){
          validPlots.push(plot);
        }
      })
      return validPlots;

    };
  });
/*
 * Convert Decimal to Days and Mins
 *
 **/
angular.module('ethMiningCalc')
  .filter('legibleYearsDaysMins', function() {
    return function(decimal) {
      var years = Math.floor(decimal/365);
      var days = Math.floor(decimal - years*365);
      var mins = Math.round((decimal - years*365 - days)*60);
      var output = "";
      // Build the text output. Be fancy and write Day(s) and Min(s)
      if (years !=0){
        if (years == 1){
          output = "1 Year ";
        } else{
          output = years + " Years ";
        };
      };
      if (days != 0){
        if (days ==1) {
          output += "1 Day ";
        } else {
          output += days + " Days ";
        };
      };
      if (mins != 0){
        if (mins==1){
          output = output + "1 Min";
        }else {
          output = output + mins + " Mins";
        };
      };
      if (years == 0 && days == 0 && mins == 0){
        output = "0 Days 0 Mins";
      };
    
     return  output;
    };
  });
