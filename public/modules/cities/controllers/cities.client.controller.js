
'use strict';

angular.module('cities').controller('CitiesController', ['$scope', '$stateParams', '$location', '$log','$modal','$timeout', 'Authentication', 'Cities', 'notify',
	function($scope, $stateParams, $location, $log, $modal, $timeout, Authentication, Cities, notify) {
		$scope.authentication = Authentication;

		$scope.create = function(city) {
			 
			city.$save(function(response) {
				  $timeout(function () {                    
						$scope.cities.unshift(response);	                 
                	},1000);
				notify({
					        message: 'City added successfully.',
					        classes: 'alert-success',
					        duration: 2000
				    });	
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(city) {
			if (city) {
				city.$remove().then(function(){
					notify({
					        message: 'City deleted successfully.',
					        classes: 'alert-success',
					        duration: 2000
				    });					
				});

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


		$scope.animationsEnabled = true;

	  	$scope.openCityModal = function (item) {
			$scope.selectedAd=item;
		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/cities/views/create-city.client.view.html',
		      controller: 'CitiesModalController',
		       
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

	  	$scope.openCityDeleteModal = function (item) {
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

	}
]);



angular.module('cities').controller('CitiesModalController', 
			['$scope', '$stateParams', '$location', '$log', 'Authentication', 'Cities',  '$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, $log, Authentication, Cities, $modalInstance, ParentScope) {
		
		$scope.create = function() {
			var city = new Cities({
				name: this.name,
				state: this.state
			});
 
			ParentScope.create(city);	
		    $modalInstance.dismiss('cancel');					
		};
		   
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
]);
