'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Category = mongoose.model('Category'),
	_ = require('lodash');

/**
 * Create a category
 */
exports.create = function(req, res) {
	var category = new Category(req.body);
	category.user = req.user;

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(category);
		}
	});
};

/**
 * Show the current category
 */
exports.read = function(req, res) {
	res.json(req.category);
};

/**
 * Update a category
 */
exports.update = function(req, res) {
	var category = req.category;

	category = _.extend(category, req.body);

	category.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(category);
		}
	});
};

/**
 * Delete an category
 */
exports.delete = function(req, res) {
	var category = req.category;

	category.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(category);
		}
	});
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
	Category.find().sort('sequence').populate('user', 'displayName').exec(function(err, categories) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(categories);
		}
	});
};

/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {
	Category.findById(id).populate('user', 'displayName').exec(function(err, category) {
		if (err) return next(err);
		if (!category) return next(new Error('Failed to load category ' + id));
		req.category = category;
		next();
	});
};

/**
 * Category authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.user.roles.indexOf("admin") === -1) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};