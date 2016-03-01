'use strict';

angular.module('images').controller('ImagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Images',
	function($scope, $stateParams, $location, Authentication, Images) {
		$scope.authentication = Authentication;
		$scope.date = {startDate: null, endDate: null};
		$scope.create = function() {
			var image = new Images({
				title: this.title,
				content: this.content,
				fromdate: $scope.date.startDate,
				todate: $scope.date.endDate
			});
			image.$save(function(response) {
				if ($scope.file) {
                            for (var i = 0; i < $scope.file.length; i++) {
                                File.imagedNewFile($scope.file[i], response.data._id);
                                //$scope.refreshDevelopmentList();
                            }
                } 
					$location.path('images/' + response._id);
					$scope.title = '';
					$scope.content = '';
                 

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(image) {
			if (image) {
				image.$remove();

				for (var i in $scope.images) {
					if ($scope.images[i] === image) {
						$scope.images.splice(i, 1);
					}
				}
			} else {
				$scope.image.$remove(function() {
					$location.path('images');
				});
			}
		};

		$scope.update = function() {
			var image = $scope.image;

			image.$update(function() {
				$location.path('images/' + image._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.images = Images.query();
		};

		$scope.findOne = function() {
			$scope.image = Images.get({
				imageId: $stateParams.imageId
			},function(responce){
				$scope.date = {startDate: responce.fromdate, endDate: responce.todate};
			});
		};
	}
]);