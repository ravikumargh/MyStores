'use strict';

angular.module('stores').controller('StoresController', 
		['$scope', '$stateParams', '$location', '$modal', '$log', '$timeout', 'Authentication', 'Stores', 'File',
	function($scope, $stateParams, $location, $modal, $log, $timeout, Authentication, Stores, File) {
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
				// $location.path('stores/' + response._id);

				// $scope.name = '';
				// $scope.address = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}).then(function(res){
				File.addNewFile(file, res._id).then(function(res){
				 
          		});
			});
		};

		$scope.remove = function(store) {
			if (store) {
				store.$remove();

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
         
	}
]);


angular.module('stores').controller('StoresModalController',
['$scope', '$stateParams', '$location', 'Authentication', 'Stores', 'File', '$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, Authentication, Stores, File, $modalInstance, ParentScope) {
 
		$scope.authentication = Authentication;
		
		$scope.create = function() {
			var store = new Stores({
				name: this.name,
				address: this.address
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
