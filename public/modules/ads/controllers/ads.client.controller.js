'use strict';

angular.module('ads').controller('AdsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ads',
	function($scope, $stateParams, $location, Authentication, Ads) {
		$scope.authentication = Authentication;
		$scope.date = {startDate: null, endDate: null};
		$scope.create = function() {
			var ad = new Ads({
				title: this.title,
				content: this.content,
				fromdate: $scope.date.startDate,
				todate: $scope.date.endDate
			});
			ad.$save(function(response) {
				if ($scope.file) {
                            for (var i = 0; i < $scope.file.length; i++) {
                                File.addNewFile($scope.file[i], response.data._id);
                                //$scope.refreshDevelopmentList();
                            }
                } 
					$location.path('ads/' + response._id);
					$scope.title = '';
					$scope.content = '';
                 

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(ad) {
			if (ad) {
				ad.$remove();

				for (var i in $scope.ads) {
					if ($scope.ads[i] === ad) {
						$scope.ads.splice(i, 1);
					}
				}
			} else {
				$scope.ad.$remove(function() {
					$location.path('ads');
				});
			}
		};

		$scope.update = function() {
			var ad = $scope.ad;

			ad.$update(function() {
				$location.path('ads/' + ad._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.ads = Ads.query();
		};

		$scope.findOne = function() {
			$scope.ad = Ads.get({
				adId: $stateParams.adId
			},function(responce){
				$scope.date = {startDate: responce.fromdate, endDate: responce.todate};
			});
		};
	}
]);