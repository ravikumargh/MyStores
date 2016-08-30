'use strict';

//Ads service used for communicating with the ads REST endpoints
angular.module('ads').factory('Ads', ['$resource',
	function($resource) {
		return $resource('ads/:adId', {
			adId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
angular.module('ads').factory('AdPublish', ['$http',
	function ($http) {
	    var urlBase = '/ads';
	    var dataFactory = {};
	     
	    dataFactory.update = function (ad) {
	        return $http.put('ads/'+ad._id+'/publish', {
	            'ispublished': ad.ispublished
	        });
	    };
	   
	    return dataFactory;
	}
]);
angular.module('ads').factory('StoreAds', ['$resource',
	function ($resource) {
	    return $resource('ads/store/:storeId', {
	        storeId: '@store'
	    });
	}
]);
angular.module('ads').factory('OutletAds', ['$resource',
	function ($resource) {
	    return $resource('ads/outlet/:outletId', {
	        outletId: '@outlets'
	    });
	}
]);
angular.module('ads').factory('AdOffers', ['$resource',
	function($resource) {
		return $resource('ads/:adId/offers/:offerId', {
			adId: '@ad',offerId:'@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);