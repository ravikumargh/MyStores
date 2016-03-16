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
	}
]);