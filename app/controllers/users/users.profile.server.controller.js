'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};



/**
 * Outlet User
 */
exports.outletusers = function(req, res) {
	User.where('outlets').in([req.params.outletId]).exec(function(err, users) {
		if (err) return next(err);
		if (!users) return next(new Error('Failed to load User ' + id));
		for (var i = users.length - 1; i >= 0; i--) {				
		 	users[i].password = undefined;
			users[i].salt = undefined;
		};
		return res.status(200).json(users);
	});
};

exports.delete = function(req, res) {
	var user = req.user;
 User.find({ '_id': req.params.userId }).remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			return res.status(200).send({
				message: "OK"
			});
		}
	});
 
};

/**
 * Store User
 */
exports.storeusers = function(req, res) {
	User.where('stores').in([req.params.storeId]).exec(function(err, users) {
		if (err) return next(err);
		if (!users) return next(new Error('Failed to load User ' + id));
		for (var i = users.length - 1; i >= 0; i--) {				
		 	users[i].password = undefined;
			users[i].salt = undefined;
		};
		return res.status(200).json(users);
	});
};