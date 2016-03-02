'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Offer = mongoose.model('Offer'),
	_ = require('lodash');

/**
 * Create a offer
 */
exports.create = function(req, res) {
	var offer = new Offer(req.body);
	offer.user = req.user;

	offer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(offer);
		}
	});
};

/**
 * Show the current offer
 */
exports.read = function(req, res) {
	res.json(req.offer);
};

/**
 * Update a offer
 */
exports.update = function(req, res) {
	var offer = req.offer;

	offer = _.extend(offer, req.body);

	offer.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(offer);
		}
	});
};

/**
 * Delete an offer
 */
exports.delete = function(req, res) {
	var offer = req.offer;

	offer.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(offer);
		}
	});
};

/**
 * List of Offers
 */
exports.list = function(req, res) {
	Offer.find().sort('-created').populate('user', 'displayName').exec(function(err, offers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(offers);
		}
	});
};

/**
 * List of Offers By outletId
 */
exports.listByAdId = function(req, res) {
	Offer.find({'ad':req.params.adId}).sort('-created').populate('user', 'displayName').exec(function(err, offers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(offers);
		}
	});
};

/**
 * Offer middleware
 */
exports.offerByID = function(req, res, next, id) {
	Offer.findById(id).populate('user', 'displayName').exec(function(err, offer) {
		if (err) return next(err);
		if (!offer) return next(new Error('Failed to load offer ' + id));
		req.offer = offer;
		next();
	});
};

/**
 * Offer authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.offer.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};