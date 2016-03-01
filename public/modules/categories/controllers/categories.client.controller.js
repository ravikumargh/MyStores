
'use strict';

angular.module('categories').controller('CategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Categories',
	function($scope, $stateParams, $location, Authentication, Categories) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var category = new Categories({
				name: this.name,
				role: this.role
			});
			category.$save(function(response) {
				$location.path('categories');

				$scope.name = '';
				$scope.role = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(category) {
			if (category) {
				category.$remove();

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
	}
]);