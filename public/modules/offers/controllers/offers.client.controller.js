'use strict';

angular.module('offers').controller('OffersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offers',
	function($scope, $stateParams, $location, Authentication, Offers) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var offer = new Offers({
				title: this.title,
				content: this.content
			});
			offer.$save(function(response) {
				$location.path('offers/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(offer) {
			if (offer) {
				offer.$remove();

				for (var i in $scope.offers) {
					if ($scope.offers[i] === offer) {
						$scope.offers.splice(i, 1);
					}
				}
			} else {
				$scope.offer.$remove(function() {
					$location.path('offers');
				});
			}
		};

		$scope.update = function() {
			var offer = $scope.offer;

			offer.$update(function() {
				$location.path('offers/' + offer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.offers = Offers.query();
		};

		$scope.findOne = function() {
			$scope.offer = Offers.get({
				offerId: $stateParams.offerId
			});
		};
	}
]);