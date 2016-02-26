
'use strict';

angular.module('cities').controller('CitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cities',
	function($scope, $stateParams, $location, Authentication, Cities) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var city = new Cities({
				name: this.name,
				state: this.state
			});
			city.$save(function(response) {
				$location.path('cities');

				$scope.name = '';
				$scope.state = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(city) {
			if (city) {
				city.$remove();

				for (var i in $scope.cities) {
					if ($scope.cities[i] === city) {
						$scope.cities.splice(i, 1);
					}
				}
			} else {
				$scope.city.$remove(function() {
					$location.path('cities');
				});
			}
		};

		$scope.update = function() {
			var city = $scope.city;

			city.$update(function() {
				$location.path('cities/' + city._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.cities = Cities.query();
		};

		$scope.findOne = function() {
			$scope.city = Cities.get({
				cityId: $stateParams.cityId
			});
		};
	}
]);