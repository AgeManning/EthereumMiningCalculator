angular.module('ethMiningCalc')
  .factory('PredictionService', [function() {
    var factory = {};

    factory.predict = function(type,predictData){
      switch(type){
        case "linear":
          return linearPredict(predictData);
          break;
        case "quadratic":
          return quadraticPredict(predictData);
          break;
        case "exponential":
          return exponentialPredict(predictData);
          break;
        case "automatic":
          return automaticPredict(predictData);
          break;

      };

    }

    /* Linear Prediction of Difficulty 
     */
    linearPredict = function(data) {
      // Linear Prediction Variables
      var predictionVariables = {};
      predictionVariables.type="linear"; //This is so we know which fit the automatic predictor has found.
      // Linear Prediction y = ax + b
      
      // Means
      var dayMean = 0;
      var diffMean = 0;
      var length = 0;
      for(var day in data) {
        difficulty = data[day];
        length += 1
        dayMean += Number(day);
        diffMean += difficulty;
      };
      dayMean = dayMean/length;
      diffMean = diffMean/length;
      //Squares
      var Sxy = 0;
      var Sxx = 0;
      for(var day in data) {
        difficulty = data[day];
        Sxx += Math.pow(Number(day) - dayMean,2);
        Sxy += (Number(day)-dayMean)*(difficulty - diffMean);
      };
    
      predictionVariables.a = Sxy/Sxx;
      predictionVariables.b = diffMean - predictionVariables.a*dayMean;

      var predictionFunction = function(day){
        return predictionVariables.a*day + predictionVariables.b;
      }
      
      predictionVariables.R2 = calculateR2(data,predictionFunction);

      return predictionVariables;

    };

    /* Quadratic Prediction - Slightly more difficult
     */
    quadraticPredict = function(data){
      // Linear Prediction Variables
      var predictionVariables = {};
      predictionVariables.type="quadratic"; //This is so we know which fit the automatic predictor has found.
      // Linear Prediction y = ax + b
      // Summations
      var Sums = [];
      // We need an array of sums, which represent S[p,q], which is sum to n of xi^p yi^q
      for(var j=0;j<=4;j++) // Loop of x power
      {
        Sums.push([]);
        for(var k=0; k<=1;k++){ //Loop of y power
          Sums[j].push(0);
          for(var day in data){
            x = Number(day);
            y = data[day];
            Sums[j][k] += Math.pow(x,j)*Math.pow(y,k);
          };
        };
      };
      var Denom = Sums[0][0]*Sums[2][0]*Sums[4][0] - Math.pow(Sums[1][0],2)*Sums[4][0] - Sums[0][0]*Math.pow(Sums[3][0],2) + 2*Sums[1][0]*Sums[2][0]*Sums[3][0] - Math.pow(Sums[2][0],3);
      
      // If the fit is linear, use the linear prediction. 
      if (Denom==0){
        var variables = linearPredict(data);
        predictionVariables.a = 0;
        predictionVariables.b = variables.a;
        predictionVaraibles.c = variables.b;
        return predictionVariables;
      };


      predictionVariables.a = (Sums[0][1]*Sums[1][0]*Sums[3][0] - Sums[1][1]*Sums[0][0]*Sums[3][0] - Sums[0][1]*Math.pow(Sums[2][0],2) + Sums[1][1]*Sums[1][0]*Sums[2][0] + Sums[2][1]*Sums[0][0]*Sums[2][0] -Sums[2][1]*Math.pow(Sums[1][0],2))/Denom;
      
      predictionVariables.b = (Sums[1][1]*Sums[0][0]*Sums[4][0] - Sums[0][1]*Sums[1][0]*Sums[4][0] + Sums[0][1]*Sums[2][0]*Sums[3][0] - Sums[2][1]*Sums[0][0]*Sums[3][0] - Sums[1][1]*Math.pow(Sums[2][0],2) +Sums[2][1]*Sums[1][0]*Sums[2][0])/Denom;


      predictionVariables.c = (Sums[0][1]*Sums[2][0]*Sums[4][0] - Sums[1][1]*Sums[1][0]*Sums[4][0] - Sums[0][1]*Math.pow(Sums[3][0],2) + Sums[1][1]*Sums[2][0]*Sums[3][0] + Sums[2][1]*Sums[1][0]*Sums[3][0] -Sums[2][1]*Math.pow(Sums[2][0],2))/Denom;


      var predictionFunction = function(day){
        return predictionVariables.a*Math.pow(day,2) + predictionVariables.b*day + predictionVariables.c;
      }
      
      predictionVariables.R2 = calculateR2(data,predictionFunction);

      return predictionVariables;

    };

    exponentialPredict = function(data){

      var predictionVariables = {};
      predictionVariables.type="exponential"; //This is so we know which fit the automatic predictor has found.
      // Variables
      var sums = {};
      sums.xy= 0;
      sums.x2y =0;
      sums.ylny=0;
      sums.xylny=0;
      sums.y=0;

      for(var day in data){
        x = Number(day);
        y = data[day];
        sums.xy += x*y;
        sums.x2y += Math.pow(x,2)*y;
        sums.ylny += y*Math.log(y);
        sums.xylny += x*y*Math.log(y);
        sums.y += y;
      };
      
      var denom = sums.y*sums.x2y - Math.pow(sums.xy,2);
      
      predictionVariables.a = Math.exp((sums.x2y*sums.ylny - sums.xy*sums.xylny)/denom);
      predictionVariables.b = (sums.y*sums.xylny - sums.xy*sums.ylny)/denom;

      var predictionFunction = function(day){
        return predictionVariables.a*Math.exp(predictionVariables.b*day);
      }
      
      predictionVariables.R2 = calculateR2(data,predictionFunction);
      return predictionVariables;
    };


    
    calculateR2 = function(data,predictionFunction){

    var variance = 0;
    var residualSumSquare =0;
    var mean = 0;
    var totalPoints = 0;
    for (var day in data){
      totalPoints +=1;
      mean += data[day];
    };
    mean = mean/totalPoints;

    // Calculate residuals
    for(var day in data){
      variance += Math.pow(data[day] - mean,2);
      residualSumSquare += Math.pow(data[day] - predictionFunction(Number(day)),2);
    };

    var R2 = 1 - residualSumSquare/variance;
    return R2;
    };


    // This function calculates the R2 for each type and chooses the best one
    automaticPredict = function(data){
      var predictionVariables = {};
      predictionVariables.linear =  linearPredict(data);
      predictionVariables.quadratic =  quadraticPredict(data);
      predictionVariables.exponential =  exponentialPredict(data);

      // Find the best R2 value
      if (predictionVariables.linear.R2 > predictionVariables.quadratic.R2 && predictionVariables.linear.R2 > predictionVariables.exponential.R2){
        return predictionVariables.linear;
      }
      if (predictionVariables.quadratic.R2 > predictionVariables.linear.R2 && predictionVariables.quadratic.R2 > predictionVariables.exponential.R2){
        return predictionVariables.quadratic;
      }
      if (predictionVariables.exponential.R2 > predictionVariables.linear.R2 && predictionVariables.exponential.R2 > predictionVariables.quadratic.R2){
        return predictionVariables.exponential;
      }
    }






    return factory;
  }]);
