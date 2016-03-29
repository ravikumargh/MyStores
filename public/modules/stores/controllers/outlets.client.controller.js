'use strict';

angular.module('outlets').controller('OutletsController', ['$scope', '$http', '$stateParams', '$location', '$modal', 'Authentication', 'Outlets', 'Storeoutlets', 'OutletUsers', 'Users', 'notify', 'Cities',
	function ($scope, $http, $stateParams, $location, $modal, Authentication, Outlets, Storeoutlets, OutletUsers, Users, notify, Cities) {
	    $scope.authentication = Authentication;
	    var authorised = false;
	    if ($scope.authentication.user && ($scope.authentication.user.roles.indexOf(ApplicationEnums.Roles.Admin) === -1 ||
			$scope.authentication.user.roles.indexOf(ApplicationEnums.Roles.OutletAdmin) === -1 ||
			$scope.authentication.user.roles.indexOf(ApplicationEnums.Roles.StoreAdmin) === -1)) {
	        authorised = true;
	    };
	    if (!authorised) {
	        $location.path('/');
	    };
	     
	    $scope.storeId = $stateParams.storeId;
	    $scope.outletId = $stateParams.outletId;
	    $scope.create = function () {
	        var outlet = new Outlets({
	            name: this.name,
	            address: this.address,
	            store: $stateParams.storeId,
	            city: $scope.selectedCity
	        });
	        outlet.$save(function (response) {
	            $location.path('outlets/' + response._id);                 
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        });
	    };

	    $scope.openCreateAdminModal = function (item) {
	        $scope.selectedUser = item;

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

	    $scope.createAdmin = function () {
	        $scope.credentials.outlets = [];
	        $scope.credentials.roles = [];
	        $scope.credentials.outlets.push($scope.outletId);
	        $scope.credentials.roles.push('outletadmin');

	        $http.post('/users/create', $scope.credentials).success(function (response) {
	            // If successful we assign the response to the global user model
	            //$scope.authentication.user = response;

	            // And redirect to the index page
	            $location.path('/');
	        }).error(function (response) {
	            $scope.error = response.message;
	        });
	    };
	    $scope.getAdmins = function () {
	        //$http.get('/users/outlet/' + $scope.outletId).success(function (response) {
	        //    // If successful we assign the response to the global user model
	        //    $scope.users = response;


	        //}).error(function (response) {
	        //    $scope.error = response.message;
	        //});
	        
	        $scope.users = OutletUsers.query({
	            outletId: $stateParams.outletId
	        });
	    };
	    $scope.getAdmins();
	    $scope.remove = function (outlet) {
	        if (outlet) {
	            outlet.$remove();

	            for (var i in $scope.outlets) {
	                if ($scope.outlets[i] === outlet) {
	                    $scope.outlets.splice(i, 1);
	                }
	            }
	        } else {
	            $scope.outlet.$remove(function () {
	                $location.path('stores/' + $scope.outlet.store);
	            });
	        }
	    };
	    $scope.removeUser = function (user) {
	        if (user) {
	        $http.delete('/users/' + user._id).success(function (response) {
	            for (var i in $scope.users) {
	                if ($scope.users[i] === user) {
	                    $scope.users.splice(i, 1);
	                }
	            }
	            notify({
	                message: 'user deleted successfully.',
	                classes: 'alert-success',
	                duration: 2000
	            });
	        }).error(function (response) {
	            $scope.error = response.message;
	        });

	        }  
	    };
	    $scope.createOrUpdate = function () {
	        var outlet = $scope.outlet;
	        if (outlet._id) {
	            $scope.update(outlet);
	        } else {
	            $scope.createOutlet(outlet);
	        }
	        
	    };
	    $scope.createOutlet = function (outlet) {
	        outlet.store = $stateParams.storeId;
	        outlet.city = $scope.selectedCity;

	        outlet.$save(function (response) {
	            $location.path('stores/' + outlet.store);
	            $scope.name = '';
	            $scope.address = '';
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        });
	    };
	    $scope.update = function (outlet) {
	        outlet.$update(function () {
	            $location.path('stores/' + outlet.store);
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        });
	    };

	    $scope.find = function () {
	        Storeoutlets.getStoreOutlets($scope.storeId).success(function (response) {
	            $scope.outlets = response;
	        })
           .error(function (errorResponse) {
               //$scope.error = errorResponse.data.message;
           });
	    };

	    $scope.findOne = function () {
	        $scope.outlet = Outlets.get({
	            outletId: $stateParams.outletId
	        });
	        $scope.cities = Cities.query();
	    };
	    $scope.createUser = function (newUser) {

	        newUser.outlets = [$stateParams.outletId];
	        newUser.roles = ["outletadmin"];
	        newUser.username = newUser.email;
	        newUser.stores = [Authentication.user.stores[0]];

	        $http.post('/users/create', newUser).success(function (response) {
	            $scope.users.unshift(response);
	            notify({
	                message: 'user created successfully.',
	                classes: 'alert-success',
	                duration: 2000
	            });
	        }).error(function (response) {
	            $scope.error = response.message;
	        });
	    };


	    /*Map starts***********************************************************/
	    var map;

	    $scope.location = { H: 12.3474743, L: 76.6033769 }
	    $scope.center = [$scope.location.H, $scope.location.L];

	    $scope.$on('mapInitialized', function (evt, evtMap) {
	        map = evtMap;

	        $scope.position = map.center;

	        map.addListener('click', function (event) {
	            clearMarkers();
	            $scope.position = event.latLng;
	            //console.log($scope.position);
	            addMarker(event.latLng);
	        });
	    });

	    var markers = [];
	    // Adds a marker to the map and push to the array.
	    function addMarker(location) {
	        var marker = new google.maps.Marker({
	            position: location,
	            map: map,
	            draggable: true
	        });
	        markers.push(marker);
	        marker.addListener('drag', function (position) {
	            $scope.position = position.latLng;
	            //$scope.development.location.address = $scope.searchAddress.address
	            $scope.latitude = position.latLng.H;
	            $scope.longitude = position.latLng.L;
	            //console.log($scope.development.location);
	        });
	    }

	    // Sets the map on all markers in the array.
	    function setMapOnAll(map) {
	        for (var i = 0; i < markers.length; i++) {
	            markers[i].setMap(map);
	        }
	    }

	    // Removes the markers from the map, but keeps them in the array.
	    function clearMarkers() {
	        setMapOnAll(null);
	    }

	    // Shows any markers currently in the array.
	    function showMarkers() {
	        setMapOnAll(map);
	    }

	    // Deletes all markers in the array by removing references to them.
	    function deleteMarkers() {
	        clearMarkers();
	        markers = [];
	    }

	    /*Map ends*/
	    /*address search starts*/
	    //$scope.searchAddress = { address: '', latitude: '', longitude: '',landmark:'' };
	    $scope.searchOptions = null;
	    $scope.searchResultDetails = '';
	    $scope.searchOptions = {
	        types: ['(address)'],
	        componentRestrictions: { country: 'IN' }
	    }
	    $scope.$watch('outlet.address.components.location.lat', function (searchAddress) {
	        if (searchAddress) {
	            $scope.center = [$scope.outlet.address.components.location.lat, $scope.outlet.address.components.location.long];
	            $scope.location.H = $scope.outlet.address.components.location.lat;
	            $scope.location.L = $scope.outlet.address.components.location.long;
	            addMarker(new google.maps.LatLng($scope.location.H, $scope.location.L))
	        }
	    });
	    /*address search ends*/

	    $scope.deleteOutletConfirmationModal = function (item) {
	        $scope.message = "Are you sure want to delete this item?";
	        $scope.selectedItem = item;
	        var modalInstance = $modal.open({
	            animation: $scope.animationsEnabled,
	            templateUrl: 'modules/cammon/views/confirmation-modal.client.view.html',
	            controller: 'ConfirmationModalController',

	            resolve: {
	                ParentScope: function () {
	                    return $scope;
	                }
	            }
	        });

	        modalInstance.result.then(function (selectedItem) {
	            $scope.remove(selectedItem);
	        }, function () {
	            $log.info('Modal dismissed at: ' + new Date());
	        });
	    };
	    $scope.deleteOutletAdminConfirmationModal = function (item) {
	        $scope.message = "Are you sure want to delete this item?";
	        $scope.selectedItem = item;
	        var modalInstance = $modal.open({
	            animation: $scope.animationsEnabled,
	            templateUrl: 'modules/cammon/views/confirmation-modal.client.view.html',
	            controller: 'ConfirmationModalController',

	            resolve: {
	                ParentScope: function () {
	                    return $scope;
	                }
	            }
	        });

	        modalInstance.result.then(function (selectedItem) {
	            $scope.removeUser(selectedItem);
	        }, function () {
	            $log.info('Modal dismissed at: ' + new Date());
	        });
	    };
	}
]);


angular.module('users').controller('UsersModalController',
['$scope', '$stateParams', '$location', '$http', 'Authentication', 'Users', '$modalInstance', 'ParentScope',
	function ($scope, $stateParams, $location, $http, Authentication, Users, $modalInstance, ParentScope) {

	    $scope.authentication = Authentication;

	    $scope.selectedUsers = null;
	    $scope.user = new Users({
	        firstName: this.firstName,
	        lastName: this.lastName,
	        email: this.email,
	        username: this.email
	    });
	    $scope.create = function () {

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

	    $scope.update = function () {
	        var offer = $scope.offer;

	        offer.$update(function () {
	            $location.path('offers/' + offer._id);
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        });
	    };

	    $scope.cancel = function () {
	        $modalInstance.dismiss('cancel');
	    };
	}
]);
