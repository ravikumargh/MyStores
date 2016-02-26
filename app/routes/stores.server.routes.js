'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	stores = require('../../app/controllers/stores.server.controller');

module.exports = function(app) {
	// Store Routes
	app.route('/stores')
		.get(stores.list)
		.post(users.requiresLogin, stores.create);

	app.route('/stores/:storeId')
		.get(stores.read)
		.put(users.requiresLogin, stores.hasAuthorization, stores.update)
		.delete(users.requiresLogin, stores.hasAuthorization, stores.delete);

	// Finish by binding the store middleware
	app.param('storeId', stores.storeByID);
};