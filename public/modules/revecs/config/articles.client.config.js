'use strict';

// Configuring the Revrecs module
angular.module('revrecs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Revrecs', 'revrecs', 'dropdown', '/revrecs(/create)?');
		//Menus.addSubMenuItem('topbar', 'revrecs', 'List Revrecs', 'revrecs');
		//Menus.addSubMenuItem('topbar', 'revrecs', 'New Revrec', 'revrecs/create');
	}
]);