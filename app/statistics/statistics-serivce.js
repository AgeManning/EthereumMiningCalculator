/*
 * Turns out we need to be a little bit more fancy with our Statistics. 
 *
 * Notes: With predictive modelling we need to use the Poisson Binomial Distribution
 *      Now, we are typically dealing with a large number of trials, and although theoretically
 *      we should be calculating sums for Expectation Values and Variances (as its discrete) to save 
 *      computation time without losing really much accuracy I'll be taking the integrals of the prediction
 *      functions. 
 *     
 *
 *
 *
 */
angular.module('ethMiningCalc')
  .factory('StatisticsService', [function() {
    var factory = {};

    /*
     * Expectation and Variance Functions
     * Depending on prediction type - we take integrals of each probability function 
     * as an approximation of the summation over block quanta (close estimate for large number of blocks/days). 
     */

		//Expected number of blocks solved
		factory.expectation = function(inputs,days,difficultyType) {
      var difficultyType = inputs.difficultyType;
      var blockTime = inputs.blockTime;
      var predictionVariables = inputs.predictionVariables;
      // Scale factor
      var s = blockTime/(3600*24);
      // Blocks to integrate over
      var n = days/s;
      //There is a scaling of 1e6 between TH difficulty and MH/s hashrate. Just scale the hashrate before.
      //Also, we want probability per block as we are summing over blocks. So if we are using difficulty, we must multiply by the average block time to get estimate probability per block.
      var hashRate = inputs.hashRate/(1e6)*blockTime;
      switch(difficultyType){
        case "fixed":
          return hashRate*n/inputs.difficulty;
          break;
        case "linear":
          var a = predictionVariables.a;
          var b = predictionVariables.b;
          //Take integral of 1/y=(a*x + b)^-1 |0^n
          //Singularity at a=0, defer to fixed calculation
          if (a == 0){
            return n*hashRate/b;
          }
          var linearExpectation = hashRate/(a*s)*(Math.log(a*n*s/b + 1)); // Take my word for it.
          return linearExpectation; 
          break;
        case "quadratic":
          var a = predictionVariables.a;
          var b = predictionVariables.b;
          var c = predictionVariables.c;

          /* Lets ignore integrals and complex numbers and just take the sums
          //Variable to simplify expression
          // Can be complex - Have to deal with complex nums.
          if(4*a*c - Math.pow(b,2) > 0){
            var X = s*Math.sqrt(4*a*c - Math.pow(b,2));
            var quadraticExpectation = 2*hashRate*(Math.atan(s*(2*a*n*s + b)/X) - Math.atan(s*b/X))/X; // Take my word for it.
            return quadraticExpectation; 
          }else{ // We are in the complex realm. 
            var X = Complex(0,Math.sqrt(-4*a*c + Math.pow(b,2)));
            var quadraticExpectation = 2*hashRate*(Complex.arctan((Complex(s*(2*a*n*s + b),0))['/'](X)))['-'](Complex.arctan((Complex(s*b,0)['/'](X)))['/'](X)).real(); // Take my word for it.
            console.log("int",n,quadraticExpectation);
           */ 
            //Compare to summation -- Just use this
          var sumQuadraticExpectation = 0;
          for(var i=0;i<=n;i++){
            var probability = hashRate/(a*Math.pow(i*s,2) + b*i*s + c);
            sumQuadraticExpectation += probability; 
          };
          return sumQuadraticExpectation; 

          break;
        case "exponential":
          var a = predictionVariables.a;
          var b = predictionVariables.b;
          var exponentialExpectation = hashRate*((Math.exp(n*b*s)-1)*Math.exp(-b*n*s))/(a*b*s);
          return exponentialExpectation;
          break;
      };
    }

    //Predictive Variance -- The analytic solution to the quadratic integral is messy, so I'm going to use the discrete solution, which will can involve quite a number sums
		factory.variance = function (inputs,days) {
      var difficultyType = inputs.difficultyType;
      var blockTime = inputs.blockTime;
      var predictionVariables = inputs.predictionVariables;
      // Scale factor
      var s = blockTime/(3600*24);
      // Blocks to integrate over
      var n = days/s;
     
      //There is a scaling of 1e6 between TH difficulty and MH/s hashrate. Just scale the hashrate before.
      //Also, we want probability per block as we are summing over blocks. So if we are using difficulty, we must multiply by the average block time to get estimate probability per block.
      var hashRate = inputs.hashRate/(1e6)*blockTime;
      // We are taking the integral of p(1-p) with p(n) wrt n
      switch(difficultyType){
        case "fixed":
          var variance =n*hashRate/inputs.difficulty*(1- hashRate/inputs.difficulty)
            //Return the standard deviation
          return Math.sqrt(variance);
          break;
        case "linear":
          // The linear case, essentially we just scale a
          var a = predictionVariables.a*s;
          var b = predictionVariables.b;
          var linearVariance = hashRate*(Math.log(a*n + b)*a*b*n - Math.log(b)*a*b*n -a*hashRate*n + Math.log(a*n+b)*Math.pow(b,2) - Math.log(b)*Math.pow(b,2))/(a*b*(a*n +b));
          //Return std
          return Math.sqrt(linearVariance); 
          break;
        case "quadratic":
          // Messy analytic solution, use discrete summation (This is the general solution).
          var a = predictionVariables.a;
          var b = predictionVariables.b;
          var c = predictionVariables.c;
          var quadraticVariance = 0;
          for(var j=0;j<=n;j++){
            var probability = hashRate/(a*Math.pow(s*j,2) + b*j*s + c);
            quadraticVariance += probability*(1-probability); 
           }
          return Math.sqrt(quadraticVariance); 
          break;
        case "exponential":
          //Essentially just scale b
          var a = predictionVariables.a;
          var b = predictionVariables.b*s;
          console.log
          var exponentialVariance = hashRate*Math.exp(-2*b*n)*(2*a*Math.exp(2*b*n) - 2*a*Math.exp(b*n) -Math.exp(2*n*b)*hashRate + hashRate)/(2*Math.pow(a,2)*b);

          return Math.sqrt(exponentialVariance);
          break;
      };
		}


		factory.probabilityAtLeastOneBlock = function (inputs,days) {
      var difficultyType = inputs.difficultyType;
      var blockTime = inputs.blockTime;
      var predictionVariables = inputs.predictionVariables;
      // PredictionVariables are calculated wrt to days. So we need to scale the probability functions to BlockNo's
      // Scale factor
      var s = blockTime/(3600*24);
      // Blocks to integrate over
      var n = days/s;
     
      //There is a scaling of 1e6 between TH difficulty and MH/s hashrate. Just scale the hashrate before.
      //Also, we want probability per block as we are summing over blocks. So if we are using difficulty, we must multiply by the average block time to get estimate probability per block.
      var hashRate = inputs.hashRate/(1e6)*blockTime;
      // We are taking the integral of p(1-p) with p(n) wrt n
      switch(difficultyType){
        case "fixed":
          var probability = hashRate/inputs.difficulty;
			    var probabilityLeastOneBlock = 1 - Math.pow((1 - probability),n);
          //Turn it into a percent
          return 100*probabilityLeastOneBlock;
          break;
        case "linear":
          // The linear case, essentially we just scale a. Product of probabilities
          var a = predictionVariables.a*s;
          var b = predictionVariables.b;
          var probabilityLeastOneBlock = 1;
          var probability = 0;
          for(var j=0;j<=n;j++){
            probability = hashRate/(a*j + b);
            probabilityLeastOneBlock *= (1-probability); 
           }
          return (1-probabilityLeastOneBlock)*100;
          break;
        case "quadratic":
          var a = predictionVariables.a;
          var b = predictionVariables.b;
          var c = predictionVariables.c;
          var probabilityLeastOneBlock = 1;
          for(var j=0;j<=n;j++){
            var probability = hashRate/(a*Math.pow(s*j,2) + b*j*s + c);
            probabilityLeastOneBlock *= (1-probability); 
           }
          return (1-probabilityLeastOneBlock)*100;
          break;
        case "exponential":
          //Essentially just scale b
          var a = predictionVariables.a;
          var b = predictionVariables.b*s;
          var probabilityLeastOneBlock = 1;
          for(var j=0;j<=n;j++){
            var probability = hashRate/(a*Math.exp(b*j));
            probabilityLeastOneBlock *= (1-probability); 
           }
          return (1-probabilityLeastOneBlock)*100;
          break;
      };
		}

    // Simple Statistical Methods - Fixed Probability
    //This function will return expected number of days required given a certainty. Eg how many days required to be 95% sure we will solve at least one block
    factory.daysGivenProbability =function(blockTime, Probability, prob_solving_block){
      var attempts = Math.log(1-Probability)/Math.log(1-prob_solving_block);
      return attempts*blockTime/3600/24;
    }

    // Expected Days Given Block
    factory.daysGivenBlocks = function(blockTime, Blocks, prob_solving_block) {
      var attempts = Blocks/prob_solving_block;
      return attempts*blockTime/3600/24;
    }

    return factory;
  }]);
