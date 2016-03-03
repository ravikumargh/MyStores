'use strict';

angular.module('stores').controller('StoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stores', 'File',
	function($scope, $stateParams, $location, Authentication, Stores, File) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var store = new Stores({
				name: this.name,
				address: this.address
			});
			store.$save(function(response) {
				$location.path('stores/' + response._id);

				$scope.name = '';
				$scope.address = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
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

         
         
	}
]);