'use strict';

// Configuring the Offers module
angular.module('offers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Offers', 'offers', 'dropdown', '/offers(/create)?');
		Menus.addSubMenuItem('topbar', 'offers', 'List Offers', 'offers');
		Menus.addSubMenuItem('topbar', 'offers', 'New Offer', 'offers/create');
	}
]);