'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	outlets = require('../../app/controllers/outlets.server.controller');

module.exports = function(app) {
	// Outlet Routes
	app.route('/stores/:storeId/outlets')
		.get(outlets.list);
	app.route('/outlets')
		.post(users.requiresLogin, outlets.create);

	app.route('/outlets/:outletId')
		.get(outlets.read)
		.put(users.requiresLogin, outlets.hasAuthorization, outlets.update)
		.delete(users.requiresLogin, outlets.hasAuthorization, outlets.delete);

	// Finish by binding the outlet middleware
	app.param('outletId', outlets.outletByID);
};