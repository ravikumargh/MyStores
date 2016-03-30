'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	ads = require('../../app/controllers/ads.server.controller'),
	cities = require('../../app/controllers/cities.server.controller'),
	offers = require('../../app/controllers/offers.server.controller');

module.exports = function (app) {
    // Ad Routes
    app.route('/ads/:adId/offers')
		.get(offers.listByAdId);
    app.route('/ads/store/:storeId')
		.get(ads.listByStoreId);
    app.route('/ads/outlet/:outletId')
		.get(ads.listByOutletId);

    app.route('/ads')
		.get(ads.list)
		.post(users.requiresLogin, ads.create);
    app.route('/ads/todays/:cityId')
            .get(ads.todayslist)

    app.route('/ads/:adId')
		.get(ads.read)
		.put(users.requiresLogin, ads.hasAuthorization, ads.update)
		.delete(users.requiresLogin, ads.hasAuthorization, ads.delete);

    app.route('/ads/:adId/publish')
		.put(users.requiresLogin, ads.hasAuthorization, ads.publish);

    // Finish by binding the ad middleware
    app.param('adId', ads.adByID);
    app.param('cityId', cities.cityByID);
};