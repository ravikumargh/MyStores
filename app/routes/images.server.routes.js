'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	images = require('../../app/controllers/images.server.controller');

var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');

module.exports = function(app) {
	// Image Routes
	//app.route('/stores/:storeId/images').get(images.list);
	app.route('/images').post(users.requiresLogin,  multipart(), images.create);
	//router.post('/images', multipart(), images.create);
	app.route('/images/content/:contentId')
		.get(images.show)
	app.route('/images/:imageId')
		.get(images.read)
		.put(users.requiresLogin, images.hasAuthorization, images.update)
		.delete(  images.delete);

	// Finish by binding the image middleware
	app.param('imageId', images.imageByID);
};