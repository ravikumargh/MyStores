'use strict';

angular.module('ads').controller('AdsController', 
		['$scope', '$stateParams', '$location','$modal', '$log','$http','Authentication', 'Ads', 'Offers', 'File',
		function($scope, $stateParams, $location, $modal, $log, $http, Authentication, Ads, Offers, File) {
			$scope.authentication = Authentication;
			$scope.date = {startDate: null, endDate: null};
			$scope.create = function(ad) {
				// var ad = new Ads({
				// 	title: this.title,
				// 	content: this.content,
				// 	fromdate: $scope.date.startDate,
				// 	todate: $scope.date.endDate
				// });
				ad.$save(function(response) {
					if ($scope.file) {
	                            for (var i = 0; i < $scope.file.length; i++) {
	                                File.addNewFile($scope.file[i], response.data._id);
	                                //$scope.refreshDevelopmentList();
	                            }
	                } 
						//$location.path('ads/' + response._id);
						$scope.title = '';
						$scope.content = '';
						$scope.ads.unshift(response);	                 

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

				ad.$update(function(response) {
					if ($scope.picFile) {
                    File.addNewFile($scope.picFile, response._id);
        		} 
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

			 
			 
		 	$scope.getOffers = function() {			
				$http.get('/ads/'+ $stateParams.adId +'/offers').success(function(response) {
					// If successful we assign the response to the global user model
					$scope.offers = response;
				}).error(function(response) {
					$scope.error = response.message;
				});
			};
			$scope.getOffers();

			//********************************************************************

			 

		  $scope.animationsEnabled = true;

		  $scope.openAdModal = function (item) {
			$scope.selectedAd=item;
		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/ads/views/create-ad.client.view.html',
		      controller: 'AdsModalController',
		       
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

		  $scope.openOfferModal = function (item) {
			$scope.selectedOffer=item;
		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/offers/views/create-offer.client.view.html',
		      controller: 'OffersModalController',
		       
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
		  $scope.toggleAnimation = function () {
		    $scope.animationsEnabled = !$scope.animationsEnabled;
		  };
	}
]);
 

angular.module('adsModal').controller('AdsModalController', 
			['$scope', '$stateParams', '$location', 'Authentication', 'Offers','Ads','$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, Authentication, Offers, Ads, $modalInstance, ParentScope) {
		$scope.authentication = Authentication;
		
		$scope.date = {startDate: null, endDate: null};


		$scope.create = function() {
			var ad = new Ads({
					title: this.title,
					content: this.content,
					fromdate: $scope.date.startDate,
					todate: $scope.date.endDate
				});
			for (var i = 0; i < $scope.authentication.user.outlets.length; i++) {
				if (!ad.outlets) {	
					ad.outlets=[];	
				};
				ad.outlets.push($scope.authentication.user.outlets[i]);
			};
			ParentScope.create(ad);	
		    $modalInstance.dismiss('cancel');					
		};

		$scope.remove = function(offer) {
			if (offer) {
				offer.$remove();

				for (var i in $scope.offers) {
					if ($scope.offers[i] === offer) {
						$scope.offers.splice(i, 1);
					}
				}
			} else {
				$scope.offer.$remove(function() {
					$location.path('offers');
				});
			}
		};

		$scope.update = function() {
			var offer = $scope.offer;

			offer.$update(function() {
				$location.path('offers/' + offer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.offers = Offers.query();
		};

		$scope.findOne = function() {
			$scope.offer = Offers.get({
				offerId: $stateParams.offerId
			});
		};
		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
	}
]);
 

angular.module('offersModal').controller('OffersModalController', 
			['$scope', '$stateParams', '$location', 'Authentication', 'Offers', 'File','$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, Authentication, Offers, File, $modalInstance, ParentScope) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var offer = new Offers({
				title: this.title,
				content: this.content,
				ad: $stateParams.adId
			});
			offer.$save(function(response) {
				//$location.path('offers/' + response._id);
				if ($scope.picFile) {
                    //for (var i = 0; i < $scope.picFile.length; i++) {
                        File.addNewFile($scope.picFile, response._id);
                        //$scope.refreshDevelopmentList();
                    //}
        		} 
				ParentScope.offers.push(response);
				$scope.title = '';
				$scope.content = '';
				$modalInstance.dismiss('cancel');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(offer) {
			if (offer) {
				offer.$remove();

				for (var i in $scope.offers) {
					if ($scope.offers[i] === offer) {
						$scope.offers.splice(i, 1);
					}
				}
			} else {
				$scope.offer.$remove(function() {
					$location.path('offers');
				});
			}
		};

		$scope.update = function() {
			var offer = $scope.offer;

			offer.$update(function() {
				$location.path('offers/' + offer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.offers = Offers.query();
		};

		$scope.findOne = function() {
			$scope.offer = Offers.get({
				offerId: $stateParams.offerId
			});
		};


		   

		  // $scope.ok = function () {
		  //   $modalInstance.close($scope.selected.item);
		  // };

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
	}
]);
 