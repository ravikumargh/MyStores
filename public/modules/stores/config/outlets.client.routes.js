'use strict';

// Setting up route
angular.module('outlets').config(['$stateProvider',
	function($stateProvider) {
		// Outlets state routing
		$stateProvider.
		state('listOutlets', {
			url: '/stores/:storeId/outlets',
			templateUrl: 'modules/stores/views/list-outlets.client.view.html'
		}).
		state('createOutlet', {
			url: '/stores/:storeId/outlets/create',
			templateUrl: 'modules/stores/views/edit-outlet.client.view.html'
		}).
		state('viewOutlet', {
			url: '/outlets/:outletId',
			templateUrl: 'modules/stores/views/view-outlet.client.view.html'
		}).
		state('editOutlet', {
			url: '/outlets/:outletId/edit',
			templateUrl: 'modules/stores/views/edit-outlet.client.view.html'
		}).
		state('createOutletUser', {
			url: '/outlets/:outletId/createuser',
			templateUrl: 'modules/stores/views/create-user.client.view.html'
		});
	}
]);