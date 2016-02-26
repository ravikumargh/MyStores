'use strict';

//Outlets service used for communicating with the outlets REST endpoints
angular.module('outlets').factory('Outlets', ['$resource',
	function($resource) {
		return $resource('outlets/:outletId', {
			outletId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);