'use strict';

// Setting up route
angular.module('offers').config(['$stateProvider',
	function($stateProvider) {
		// Offers state routing
		$stateProvider.
		state('listOffers', {
			url: '/offers',
			templateUrl: 'modules/offers/views/list-offers.client.view.html'
		}).
		state('createOffer', {
			url: '/offers/create',
			templateUrl: 'modules/offers/views/create-offer.client.view.html'
		}).
		state('viewOffer', {
			url: '/offers/:offerId',
			templateUrl: 'modules/offers/views/view-offer.client.view.html'
		}).
		state('editOffer', {
			url: '/offers/:offerId/edit',
			templateUrl: 'modules/offers/views/edit-offer.client.view.html'
		});
	}
]);