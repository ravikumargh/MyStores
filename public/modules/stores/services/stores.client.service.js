'use strict';

//Stores service used for communicating with the stores REST endpoints
angular.module('stores').factory('Stores', ['$resource',
	function($resource) {
		return $resource('stores/:storeId', {
			storeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);