'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	offers = require('../../app/controllers/offers.server.controller');

module.exports = function(app) {
	// Offer Routes
	app.route('/offers')
		.get(offers.list)
		.post(users.requiresLogin, offers.create);

	app.route('/offers/:offerId')
		.get(offers.reoffer)
		.put(users.requiresLogin, offers.hasAuthorization, offers.update)
		.delete(users.requiresLogin, offers.hasAuthorization, offers.delete);

	// Finish by binding the offer middleware
	app.param('offerId', offers.offerByID);
};