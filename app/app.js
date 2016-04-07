angular.module('ethMiningCalc', [
  'ui.router', 'angular-json-rpc'
]).config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('landing-page', {
      url: "/",
      controller: 'CalcController as vm',
      templateUrl: "app/landing-page/landing-page.html"
    })
    .state('calc', {
      url: "/calc",
      controller: 'CalcController as vm',
      templateUrl: "app/calc/calc.html"
    });
});
