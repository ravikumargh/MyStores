'use strict';

angular.module('outlets').controller('OutletsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Outlets', 'Storeoutlets',
	function($scope, $http, $stateParams, $location, Authentication, Outlets, Storeoutlets) {
		$scope.authentication = Authentication;
		$scope.storeId=$stateParams.storeId;
		$scope.outletId=$stateParams.outletId;
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

		$scope.createAdmin = function() {
			$scope.credentials.outlets=[];
			$scope.credentials.roles=[];
			$scope.credentials.outlets.push($scope.outletId);
			$scope.credentials.roles.push('outletadmin');
			
			$http.post('/users/create', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				//$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		$scope.getAdmins = function() {			
			$http.get('/users/outlet/'+$scope.outletId).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.users = response;

				 
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		$scope.getAdmins();
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
			Storeoutlets.getStoreOutlets($scope.storeId).success(function (response) {
            $scope.outlets = response;
           })
           .error(function (errorResponse) {
               //$scope.error = errorResponse.data.message;
           });
		};

		$scope.findOne = function() {
			$scope.outlet = Outlets.get({
				outletId: $stateParams.outletId
			});
		};
	}
]);