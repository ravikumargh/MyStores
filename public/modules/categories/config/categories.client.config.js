
'use strict';

// Configuring the Categories module
angular.module('categories').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Categories', 'categories', '', '/categories');
		// Menus.addSubMenuItem('topbar', 'categories', 'List Categories', 'categories');
		// Menus.addSubMenuItem('topbar', 'categories', 'New Category', 'categories/create');
	}
]);