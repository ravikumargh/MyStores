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
angular.module('outlets').factory('OutletUsers', ['$resource',
	function ($resource) {
	    return $resource('users/outlet/:outletId', {
	        outletId: '@outletId'
	    } );
	}
]);
angular.module('outlets').factory('Users', ['$resource',
	function ($resource) {
	    return $resource('users/:userId', {
	        userId: '@userId'
	    });
	}
]);