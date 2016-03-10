'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication', 'Ads', 'Categories',
	function($scope, $http, Authentication, Ads, Categories) {
		// This provides Authentication context.
		$scope.authentication = Authentication;


		$scope.getTodaysAds = function() {			
				$http.get('/ads/todays').success(function(response) {
					$scope.ads = response;
				}).error(function(response) {
					$scope.error = response.message;
				});
			};
		$scope.getTodaysAds();

		$scope.categories = Categories.query();
		
	}
]);