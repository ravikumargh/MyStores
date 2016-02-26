'use strict';

// Configuring the Stores module
angular.module('stores').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stores', 'stores', 'dropdown', '/stores(/create)?');
		Menus.addSubMenuItem('topbar', 'stores', 'List Stores', 'stores');
		Menus.addSubMenuItem('topbar', 'stores', 'New Store', 'stores/create');
	}
]);