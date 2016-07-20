angular.module('ethMiningCalc')

/*
  .run(function() {
    // Configure mathjax when the angular app has finished loading
    MathJax.Hub.Config({skipStartupTypeset: true});
    MathJax.Hub.Configured();
  })

  .directive("mathjaxBind", function() {
      return {
          restrict: "A",
          controller: ["$scope", "$timeout", function($scope, $timeout) {
              // $evalAsync is used here to trigger an event whenever an angular
              // digest cycle finishes
              $scope.$evalAsync(function() {
                // We are using timeout here to ensure the code executes
                // after angular has finished doing a cycle
                $timeout(function() {
                  // From what I understand, .Typeset() gets mathjax to rescan
                  // the dom and render pretty math.
                  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
                });
              });
          }]
      };
  });

*/

  .run(function() {

		MathJax.Hub.Config({
				skipStartupTypeset: true,
				messageStyle: "none",
				"HTML-CSS": {
						showMathMenu: false
				}
		});
	MathJax.Hub.Configured();
  })

	.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
            });
        }]
    };
	});
