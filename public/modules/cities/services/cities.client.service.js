
'use strict';

//Cities service used for communicating with the cities REST endpoints
angular.module('cities').factory('Cities', ['$resource',
	function($resource) {
		return $resource('cities/:cityId', {
			cityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);