'use strict';

angular.module('stores').controller('StoresController',
		['$scope', '$stateParams', '$location', '$modal', '$http', '$log', '$timeout', 'Authentication', 'Stores', 'File', 'Storeoutlets', 'notify',
	function ($scope, $stateParams, $location, $modal, $http, $log, $timeout, Authentication, Stores, File, Storeoutlets, notify) {
	    $scope.authentication = Authentication;
	    var authorised = false;
	    if ($scope.authentication.user && ($scope.authentication.user.roles.indexOf(ApplicationEnums.Roles.Admin) === -1 ||
			$scope.authentication.user.roles.indexOf(ApplicationEnums.Roles.StoreAdmin) === -1)) {
	        authorised = true;
	    };
	    if (!authorised) {
	        $location.path('/');
	    };


	    $scope.create = function (outlet, file) {	        
	        outlet.$save(function (response) {
	            $timeout(function () {
	                $scope.outlets.unshift(response);
	            }, 1000);

	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        }).then(function (res) {
	            notify({
	                message: 'Store created successfully.',
	                classes: 'alert-success',
	                duration: 2000
	            });
	            File.addNewFile(file, res._id).then(function (res) {

	            });
	        });
	    };

	    $scope.remove = function (store) {
	        if (store) {
	            File.deleteFile(store._id);
	            store.$remove().then(function () {
	                notify({
	                    message: 'Store deleted successfully.',
	                    classes: 'alert-success',
	                    duration: 2000
	                });
	            });

	            for (var i in $scope.stores) {
	                if ($scope.stores[i] === store) {
	                    $scope.stores.splice(i, 1);
	                }
	            }

	        } else {
	            $scope.store.$remove(function () {
	                $location.path('stores');
	            });
	        }
	    };

	    $scope.update = function () {
	        var store = $scope.store;

	        store.$update(function () {
	            $location.path('stores/' + store._id);
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        });
	    };

	    $scope.find = function () {
	        $scope.stores = Stores.query();


	    };

	    $scope.findOne = function () {
	        $scope.store = Stores.get({
	            storeId: $stateParams.storeId
	        });
	        Storeoutlets.getStoreOutlets($stateParams.storeId).success(function (response) {
	            $scope.outlets = response;
	        })
            .error(function (errorResponse) {
                //$scope.error = errorResponse.data.message;
            });
	    };


	    $scope.uploadFiles = function (file, errFiles) {
	        $scope.f = file;
	        $scope.errFile = errFiles && errFiles[0];
	        if (file) {
	            File.addNewFile(file, $stateParams.storeId).then(function (res) {

	            });
	        }
	    };

	    $scope.getStoreAdmins = function () {
	        $http.get('/users/store/' + $stateParams.storeId).success(function (response) {
	            // If successful we assign the response to the global user model
	            $scope.users = response;
	        }).error(function (response) {
	            $scope.error = response.message;
	        });
	    };
	    $scope.getStoreAdmins();


	    $scope.openCreateModal = function (item) {
	        $scope.selectedOffer = item;
	        var modalInstance = $modal.open({
	            animation: $scope.animationsEnabled,
	            templateUrl: 'modules/stores/views/create-store.client.view.html',
	            controller: 'StoresModalController',

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
	    $scope.openDeleteConfirmationModal = function (item) {
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

	    $scope.openCreateStoreAdminModal = function (item) {
	        $scope.selectedUser = item;
	        $scope.newUserRole = "storeadmin";

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

	    $scope.createUser = function (newUser) {

	        newUser.stores = [$stateParams.storeId];
	        newUser.roles = ["storeadmin"];
	        newUser.username = newUser.email;
	        newUser.password = 'Password1';

	        $http.post('/users/create', newUser).success(function (response) {
	            $scope.users.unshift(response);
	        }).error(function (response) {
	            $scope.error = response.message;
	        });
	    };
	    $scope.openOutletCreateModal = function (item) {
	        $scope.selectedOffer = item;
	        var modalInstance = $modal.open({
	            animation: $scope.animationsEnabled,
	            templateUrl: 'modules/stores/views/create-outlet.client.view.html',
	            controller: 'OutletsModalController',

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
	    //Outlet ******************************************************************************
	    $scope.openOuletDeleteConfirmationModal = function (item) {
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
	            $scope.removeOutlet(selectedItem);
	        }, function () {
	            $log.info('Modal dismissed at: ' + new Date());
	        });
	    };

	    $scope.removeOutlet = function (outlet) {
	        if (outlet) {

	            // outlet.$remove();
	            Storeoutlets.deleteOutlet(outlet._id).success(function (response) {
	                for (var i in $scope.outlets) {
	                    if ($scope.outlets[i] === outlet) {
	                        $scope.outlets.splice(i, 1);
	                    }
	                }
	                notify({
	                    message: 'outlet deleted successfully.',
	                    classes: 'alert-success',
	                    duration: 2000
	                });
	            }).error(function (errorResponse) {
	                notify({
	                    message: 'error: outlet not deleted.',
	                    classes: 'alert-danger',
	                    duration: 2000
	                });
	                //$scope.error = errorResponse.data.message;
	            });

	        } else {
	            $scope.outlet.$remove(function () {
	                $location.path('outlets');
	            });
	        }
	    };
	    //Outlet ******************************************************************************

	}
		]);


angular.module('stores').controller('StoresModalController',
['$scope', '$stateParams', '$location', 'Authentication', 'Stores', 'File', '$modalInstance', 'ParentScope', 'Categories',
	function ($scope, $stateParams, $location, Authentication, Stores, File, $modalInstance, ParentScope, Categories) {

	    $scope.authentication = Authentication;
	    $scope.categories = Categories.query();

	    $scope.create = function () {
	        var store = new Stores({
	            name: this.name,
	            address: this.address,
	            category: this.category

	        });
	        ParentScope.create(store, $scope.file);
	        $modalInstance.dismiss('cancel');
	    };


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


angular.module('outlets').controller('OutletsModalController',
['$scope', '$stateParams', '$location', 'Authentication', 'Outlets', 'File', 'Cities', '$modalInstance', 'ParentScope',
	function ($scope, $stateParams, $location, Authentication, Outlets, File, Cities, $modalInstance, ParentScope) {

	    $scope.authentication = Authentication;
	    $scope.cities = Cities.query();
	    $scope.selectedCity = null;

	    $scope.create = function () {
	        var outlet = new Outlets({
	            name: this.name,
	            address: this.address,
	            store: $stateParams.storeId,
	            city: $scope.selectedCity
	        });
            /*
	        outlet.$save(function (response) {
	            ParentScope.outlets.unshift(response);
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        }).then(function (res) {
	            $modalInstance.dismiss('cancel');
	        });
            */
	        ParentScope.create(outlet);
	        $modalInstance.dismiss('cancel');
	    };


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
