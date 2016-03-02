'use strict';

//Images service used for communicating with the images REST endpoints
angular.module('images').factory('Images', ['$resource',
	function($resource) {
		return $resource('images/:imageId', {
			imageId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

 
angular.module('images').factory('File', ['$http', 'Upload',
    function($http,Upload) {
        var urlBase = '/images/';
        var dataFactory = {};

        dataFactory.addNewFile = function (file, contentid) {
            return Upload.upload({
                url: urlBase,
                file: file,
                method: 'POST',
                fields: { 
                    'contentid': contentid
                },
                sendFieldsAs: 'json',
                withCredentials: true
            })
        };
        dataFactory.getFile = function(file_id) {
            return $http.get(urlBase + file_id + '/');
        };
        dataFactory.getFiles = function (poll_id) {
            return $http.get(urlBase + '/');
        };
        dataFactory.getAllPublishedFiles = function (poll_id) {
            return $http.get(urlBase + '/');
        };
        dataFactory.getContainerFiles = function (containerid) {
            return $http.get(urlBase + "container/" + containerid + '/');
        };

        dataFactory.updateFile = function(file_id, file) {
            return $http.put(urlBase + file_id + '/', {
                'file': file
            });
        };

        dataFactory.deleteFile = function(file_id) {                  
            return $http.delete(urlBase + file_id + '/');
        };

        return dataFactory;
    }
]);
