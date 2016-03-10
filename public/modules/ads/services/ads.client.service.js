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

angular.module('ads').factory('AdOffers', ['$resource',
	function($resource) {
		return $resource('ads/:adId/offers', {
			adId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);