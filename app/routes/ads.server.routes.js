'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	ads = require('../../app/controllers/ads.server.controller'),
	offers = require('../../app/controllers/offers.server.controller');

module.exports = function(app) {
	// Ad Routes
	app.route('/ads/:adId/offers')
		.get(offers.listByAdId);
	app.route('/ads')
		.get(ads.list)
		.post(users.requiresLogin, ads.create);

	app.route('/ads/:adId')
		.get(ads.read)
		.put(users.requiresLogin, ads.hasAuthorization, ads.update)
		.delete(users.requiresLogin, ads.hasAuthorization, ads.delete);

	// Finish by binding the ad middleware
	app.param('adId', ads.adByID);
};