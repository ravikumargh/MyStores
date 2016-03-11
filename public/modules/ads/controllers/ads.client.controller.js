'use strict';

angular.module('ads').controller('AdsController', 
		['$scope', '$stateParams', '$location','$modal', '$log','$http', '$timeout', 'Authentication', 'Ads', 'AdOffers', 'Offers', 'File', 'notify', '$sce',
		function($scope, $stateParams, $location, $modal, $log, $http, $timeout, Authentication, Ads, AdOffers, Offers, File, notify, $sce) {
			$scope.authentication = Authentication;
			$scope.date = {startDate: null, endDate: null};
			

		    $scope.getHtml = function(html){     
		        return $sce.trustAsHtml(html);
		    }
			$scope.create = function(ad, file) {
				// var ad = new Ads({
				// 	title: this.title,
				// 	content: this.content,
				// 	fromdate: $scope.date.startDate,
				// 	todate: $scope.date.endDate
				// });
				ad.$save(function(response) {
					$timeout(function () {                    
						$scope.ads.unshift(response);	                 
                	},1000);

				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				}).then(function(res){
					File.addNewFile(file, res._id).then(function(res){
				 
          		});
			});
			};

			$scope.remove = function(ad) {
				if (ad) {
					ad.$remove();
					File.deleteFile(ad._id);
					notify({
				        message: 'Ad deleted successfully.',
				        classes: 'alert-success',
				        duration: 2000
			    	});
			    	$location.path('ads');					 
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

				$scope.offers = AdOffers.query({
					adId: $stateParams.adId
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
			//$scope.getOffers();
			$scope.openAdDeleteModal = function (item) {
				if ($scope.offers.length) {
					notify({
				        message: 'This Ad contains '+$scope.offers.length+' offers, please delete all the offers and delete.',
				        classes: 'alert-success',
				        duration: 3000
			    	});
			    	return;
				};
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
//********************************************************************

			 

		  $scope.animationsEnabled = true;

		  $scope.openAdModal = function (item) {
			$scope.selectedAd=item;
		    var modalInstance = $modal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'modules/ads/views/create-ad.client.view.html',
		      controller: 'AdsModalController',
		      size:'lg',		       
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

//Offer ******************************************************************
		$scope.openOfferDeleteModal = function (item) {
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
		      $scope.removeOffer(selectedItem);
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });
	    };
	    $scope.removeOffer = function(offer) {
			if (offer) {

				$http.delete('/Offers/'+ offer._id).success(function(response) {
					 File.deleteFile(offer._id);
						notify({
					        message: 'Offer deleted successfully.',
					        classes: 'alert-success',
					        duration: 2000
				    	});	
				    	for (var i in $scope.offers) {
							if ($scope.offers[i] === offer) {
								$scope.offers.splice(i, 1);
							}
						}
				}).error(function(response) {
					notify({
					        message: 'Error: Offer not deleted.',
					        classes: 'alert-danger',
					        duration: 2000
				    	});	
				}); 
			} else {
				$scope.offer.$remove(function() {
					$location.path('offers');
				});
			}
		};
//Offer ******************************************************************

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
			ParentScope.create(ad, $scope.file);	
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
			['$scope', '$stateParams', '$location', '$timeout', 'Authentication', 'Offers', 'File','$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, $timeout, Authentication, Offers, File, $modalInstance, ParentScope) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var offer = new Offers({
				title: this.title,
				content: this.content,
				ad: $stateParams.adId
			});
			offer.$save(function(response) {
				  
        		$timeout(function () {                    
						ParentScope.offers.unshift(response);	                 
            	},1000);
				
				$scope.title = '';
				$scope.content = '';
				$modalInstance.dismiss('cancel');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}).then(function(res){
					File.addNewFile($scope.picFile, res._id).then(function(res){

					});
				 
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
 
 angular.module('ads').directive('hideUntilGood', function() {
  return {
    restrict: 'A',
    multiElement: true,
    link: function(scope, element, attrs) {
      attrs.$observe('ngSrc', function (value) {
        // fix where ngSrc doesn't update when blank
        if (!value || value.length == 0) {
          element.attr('src', value);
        }
        element.css("display", "none");
      });
      element.bind('load', function() {
        element.css("display", "");
      });
    }
  };
})


 angular.module('ads').filter('html', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
