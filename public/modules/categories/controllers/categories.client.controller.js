
'use strict';

angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', '$modal', '$log', '$timeout', 'Authentication', 'Categories', 'notify',
	function($scope, $stateParams, $location, $modal, $log, $timeout, Authentication, Categories, notify) {
		$scope.authentication = Authentication;

		$scope.create = function(category) {
			 
			category.$save(function(response) {
				 $timeout(function () {                    
						$scope.categories.push(response);	                 
                	},1000);
				notify({
					        message: 'Categories added successfully.',
					        classes: 'alert-success',
					        duration: 2000
				    });	
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(category) {
			if (category) {
				category.$remove().then(function(){
					notify({
					        message: 'Category deleted successfully.',
					        classes: 'alert-success',
					        duration: 2000
				    });					
				});

				for (var i in $scope.categories) {
					if ($scope.categories[i] === category) {
						$scope.categories.splice(i, 1);
					}
				}
			} else {
				$scope.category.$remove(function() {
					$location.path('categories');
				});
			}
		};

		$scope.update = function() {
			var category = $scope.category;

			category.$update(function() {
				$location.path('categories/' + category._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.categories = Categories.query();
		};

		$scope.findOne = function() {
			$scope.category = Categories.get({
				categoryId: $stateParams.categoryId
			});
		};

		$scope.animationsEnabled = true;

	  	$scope.openCategoryCreateModal = function (item) {
			$scope.selectedAd=item;
		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/categories/views/create-category.client.view.html',
		      controller: 'CategoriesModalController',
		       
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

	  	$scope.openCategoryDeleteModal = function (item) {
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

angular.module('categories').controller('CategoriesModalController', 
			['$scope', '$stateParams', '$location', '$log', 'Authentication', 'Categories',  '$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, $log, Authentication, Categories, $modalInstance, ParentScope) {
		
		$scope.create = function() {
			var Category = new Categories({
				name: this.name,
				cssclass: this.cssclass,
				sequence: this.sequence
			});
 
			ParentScope.create(Category);	
		    $modalInstance.dismiss('cancel');					
		};
		   
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}
]);
