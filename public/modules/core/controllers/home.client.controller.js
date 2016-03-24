'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication', 'Ads', 'Categories', '$sce',
	function($scope, $http, Authentication, Ads, Categories , $sce) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


		$scope.getTodaysAds = function() {
				var selectedCity=JSON.parse(localStorage.MyCity);			
				$http.get('/ads/todays/'+selectedCity._id).success(function(response) {
					$scope.ads = response;
				}).error(function(response) {
					$scope.error = response.message;
				});
			};
		$scope.getTodaysAds();

		$scope.categories = Categories.query();
		
		$scope.getHtml = function(html){     
		        return $sce.trustAsHtml(html);
		}
		$scope.tellServerItsBroken = function (html) {
		   
		}
		
	}
]);

angular.module('core')

.directive('img', function () {
    return {
        restrict: 'E',
        link: function (scope, el, attr) {
            el.on('error', function (e) {
                if (attr['ngError']) {
                    scope.$eval(attr['ngError']);
                    e.target.style.display = "none";
                }
            })
        }
    }
})