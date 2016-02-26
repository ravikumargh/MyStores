'use strict';

angular.module('outlets').controller('OutletsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Outlets',
	function($scope, $stateParams, $location, Authentication, Outlets) {
		$scope.authentication = Authentication;
		$scope.storeId=$stateParams.storeId;
		$scope.create = function() {
			var outlet = new Outlets({
				name: this.name,
				address: this.address,
				store: $stateParams.storeId
			});
			outlet.$save(function(response) {
				$location.path('outlets/' + response._id);

				$scope.name = '';
				$scope.address = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(outlet) {
			if (outlet) {
				outlet.$remove();

				for (var i in $scope.outlets) {
					if ($scope.outlets[i] === outlet) {
						$scope.outlets.splice(i, 1);
					}
				}
			} else {
				$scope.outlet.$remove(function() {
					$location.path('outlets');
				});
			}
		};

		$scope.update = function() {
			var outlet = $scope.outlet;

			outlet.$update(function() {
				$location.path('outlets/' + outlet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.outlets = Outlets.query();
		};

		$scope.findOne = function() {
			$scope.outlet = Outlets.get({
				outletId: $stateParams.outletId
			});
		};
	}
]);