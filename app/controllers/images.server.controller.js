'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Image = mongoose.model('Image'),
	_ = require('lodash');

/**
 * Create a image
 */
exports.create = function(req, res) {
	var image = new Image(req.body);
	image.user = req.user;

	image.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(image);
		}
	});
};

/**
 * Show the current image
 */
exports.read = function(req, res) {
	res.json(req.image);
};

/**
 * Update a image
 */
exports.update = function(req, res) {
	var image = req.image;

	image = _.extend(image, req.body);

	image.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(image);
		}
	});
};

/**
 * Delete an image
 */
exports.delete = function(req, res) {
	var image = req.image;

	image.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(image);
		}
	});
};

/**
 * List of Images
 */
exports.list = function(req, res) {
	Image.find().sort('-created').populate('user', 'displayName').exec(function(err, images) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(images);
		}
	});
};

/**
 * Image middleware
 */
exports.imageByID = function(req, res, next, id) {
	Image.findById(id).populate('user', 'displayName').exec(function(err, image) {
		if (err) return next(err);
		if (!image) return next(new Error('Failed to load image ' + id));
		req.image = image;
		next();
	});
};

/**
 * Image authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.image.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};