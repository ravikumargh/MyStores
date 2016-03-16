'use strict';

angular.module('outlets').controller('OutletsController', ['$scope', '$http', '$stateParams', '$location', '$modal', 'Authentication', 'Outlets', 'Storeoutlets',
	function($scope, $http, $stateParams, $location, $modal, Authentication, Outlets, Storeoutlets) {
		$scope.authentication = Authentication;
		var authorised=false;
		if ($scope.authentication.user && ($scope.authentication.user.roles.indexOf(ApplicationEnums.Roles.Admin) === -1 || 
			$scope.authentication.user.roles.indexOf(ApplicationEnums.Roles.OutletAdmin) === -1 ||
			$scope.authentication.user.roles.indexOf(ApplicationEnums.Roles.StoreAdmin) === -1)) {
			authorised=true;
		};
		if (!authorised) {
			$location.path('/'); 
		};

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

		$scope.openCreateAdminModal = function (item) {
			$scope.selectedUser=item;
			 
		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/stores/views/create-user-modal.client.view.html',
		      controller: 'UsersModalController',
		       
		      resolve: {
		        ParentScope: function () {
		          return $scope;
		        }
		      }
		    });

		    modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
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
		$scope.createUser = function(newUser) {
			
			newUser.outlets= [$stateParams.outletId];
			newUser.roles= ["outletadmin"];
			newUser.username=  newUser.email;
			
			$http.post('/users/create', newUser).success(function(response) {
				$scope.users.unshift(response);
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);


angular.module('users').controller('UsersModalController',
['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Users', '$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, $http, Authentication, Users, $modalInstance, ParentScope) {
 
		$scope.authentication = Authentication;
		
		$scope.selectedUsers = null;
		$scope.user = new Users({
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			username: this.email 
		});
		$scope.create = function() {
			 
			ParentScope.createUser($scope.user);
			$modalInstance.dismiss('cancel');
		};
		/*
		$scope.user = new Users({
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			username: this.email,
			password: 'Password1',
			outlets: [$stateParams.outletId],
			roles: [ParentScope.newUserRole]
		});
		$scope.create = function() {
			$scope.user.username = $scope.user.email;
			$http.post('/users/create', $scope.user).success(function(response) {
				ParentScope.users.unshift(response);
				 $modalInstance.dismiss('cancel');

			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		*/
  
		$scope.update = function() {
			var offer = $scope.offer;

			offer.$update(function() {
				$location.path('offers/' + offer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	}
]);
