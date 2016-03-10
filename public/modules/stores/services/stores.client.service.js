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
//Storeoutlets service used for communicating with the stores REST endpoints
angular.module('storeoutlets').factory('Storeoutlets', ['$http',
	function($http) {
		var urlBase = '/stores/';
        var dataFactory = {};
        dataFactory.getStoreOutlets = function (store_id) {
            return $http.get(urlBase + store_id + '/outlets');
        }; 
        dataFactory.deleteOutlet = function (outletid) {
            return $http.delete('/outlets/' + outletid);
        };        

        return dataFactory;
	}
]);