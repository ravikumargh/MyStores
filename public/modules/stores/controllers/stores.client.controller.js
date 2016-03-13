'use strict';

angular.module('stores').controller('StoresController', 
		['$scope', '$stateParams', '$location', '$modal', '$log', '$timeout', 'Authentication', 'Stores', 'File', 'Storeoutlets', 'notify',
	function($scope, $stateParams, $location, $modal, $log, $timeout, Authentication, Stores, File, Storeoutlets, notify) {
		$scope.authentication = Authentication;

		$scope.create = function(store, file) {
			// var store = new Stores({
			// 	name: this.name,
			// 	address: this.address
			// });
			store.$save(function(response) {
				$timeout(function () {                    
					$scope.stores.unshift(response);
                },1000);
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}).then(function(res){
				File.addNewFile(file, res._id).then(function(res){
				 
          		});
			});
		};

		$scope.remove = function(store) {
			if (store) {
				File.deleteFile(store._id);
				store.$remove().then(function(){
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
				$scope.store.$remove(function() {
					$location.path('stores');
				});
			}
		};

		$scope.update = function() {
			var store = $scope.store;

			store.$update(function() {
				$location.path('stores/' + store._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.stores = Stores.query();

           
		};

		$scope.findOne = function() {
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


		$scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
          	File.addNewFile(file, $stateParams.storeId).then(function(res){
				 
          	});
            }
         };

        $scope.openCreateModal = function (item) {
			$scope.selectedOffer=item;
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
			$scope.message="Are you sure want to delete this item?";
			$scope.selectedItem=item;
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

         $scope.openOutletCreateModal = function (item) {
			$scope.selectedOffer=item;
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
			$scope.message="Are you sure want to delete this item?";
			$scope.selectedItem=item;
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
 
	    $scope.removeOutlet = function(outlet) {
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
				$scope.outlet.$remove(function() {
					$location.path('outlets');
				});
			}
		};
//Outlet ******************************************************************************

	}
]);


angular.module('stores').controller('StoresModalController',
['$scope', '$stateParams', '$location', 'Authentication', 'Stores', 'File', '$modalInstance', 'ParentScope', 'Categories',
	function($scope, $stateParams, $location, Authentication, Stores, File, $modalInstance, ParentScope, Categories) {
 
		$scope.authentication = Authentication;
		$scope.categories = Categories.query();
		
		$scope.create = function() {
			var store = new Stores({
				name: this.name,
				address: this.address,
					category: this.category

			});
			ParentScope.create(store, $scope.file);
			$modalInstance.dismiss('cancel');
		};

  
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


angular.module('outlets').controller('OutletsModalController',
['$scope', '$stateParams', '$location', 'Authentication', 'Outlets', 'File', 'Cities', '$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, Authentication, Outlets, File, Cities, $modalInstance, ParentScope) {
 
		$scope.authentication = Authentication;
		$scope.cities = Cities.query();
		$scope.selectedCity = null;

		$scope.create = function() {
			var outlet = new Outlets({
				name: this.name,
				address: this.address,
				store: $stateParams.storeId,
				city: $scope.selectedCity
			});

			outlet.$save(function(response) {
				                    
					ParentScope.outlets.unshift(response);
                
				
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}).then(function(res){
				 $modalInstance.dismiss('cancel');
			});

			ParentScope.create(outlet);
			$modalInstance.dismiss('cancel');
		};

  
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
