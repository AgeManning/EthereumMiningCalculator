angular.module('ethMiningCalc', [
  'ui.router'
]).config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/calc");
  //
  // Now set up the states
  $stateProvider
    .state('calc', {
      url: "/calc",
      templateUrl: "app/views/main.html"
    });
});