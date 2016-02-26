'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	cities = require('../../app/controllers/cities.server.controller');

module.exports = function(app) {
	// City Routes
	app.route('/cities')
		.get(cities.list)
		.post(users.requiresLogin, cities.create);

	app.route('/cities/:cityId')
		.get(cities.read)
		.put(users.requiresLogin, cities.hasAuthorization, cities.update)
		.delete(users.requiresLogin, cities.hasAuthorization, cities.delete);

	// Finish by binding the city middleware
	app.param('cityId', cities.cityByID);
};