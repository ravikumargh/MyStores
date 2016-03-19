'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Outlet = mongoose.model('Outlet'),
	_ = require('lodash');

/**
 * Create a outlet
 */
exports.create = function (req, res) {
    var outlet = new Outlet(req.body);
    outlet.user = req.user;

    outlet.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(outlet);
        }
    });
};

/**
 * Show the current outlet
 */
exports.read = function (req, res) {
    res.json(req.outlet);
};

/**
 * Update a outlet
 */
exports.update = function (req, res) {
    var outlet = req.outlet;

    outlet = _.extend(outlet, req.body);

    outlet.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(outlet);
        }
    });
};

/**
 * Delete an outlet
 */
exports.delete = function (req, res) {
    var outlet = req.outlet;

    outlet.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(outlet);
        }
    });
};

/**
 * List of Outlets
 */
exports.list = function (req, res) {
    Outlet.find({ 'store': req.params.storeId }).sort('-created')
	.populate('user', 'displayName')
	.populate('city', 'name').exec(function (err, outlets) {
	    if (err) {
	        return res.status(400).send({
	            message: errorHandler.getErrorMessage(err)
	        });
	    } else {
	        res.json(outlets);
	    }
	});
};

/**
 * Outlet middleware
 */
exports.outletByID = function (req, res, next, id) {
    Outlet.findById(id)
    .populate('user', 'displayName')
    .populate('city').exec(function (err, outlet) {
        if (err) return next(err);
        if (!outlet) return next(new Error('Failed to load outlet ' + id));
        req.outlet = outlet;
        next();
    });
};

/**
 * Outlet authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.roles.indexOf("admin") === 0 || req.user.roles.indexOf("storeadmin") === 0) {
        next();
    }
    else {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
};