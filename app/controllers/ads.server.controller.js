'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ad = mongoose.model('Ad'),
	_ = require('lodash');

/**
 * Create a ad
 */
exports.create = function (req, res) {
    var ad = new Ad(req.body);
    ad.user = req.user;

    ad.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ad);
        }
    });
};

/**
 * Show the current ad
 */
exports.read = function (req, res) {
    res.json(req.ad);
};

/**
 * Update a ad
 */
exports.update = function (req, res) {
    var ad = req.ad;

    ad = _.extend(ad, req.body);

    ad.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ad);
        }
    });
};


/**
 * publish a ad
 */
exports.publish = function (req, res) {
    var ad = req.ad;

    ad = _.extend(ad, req.body);

    ad.ispublished = req.body.ispublished;
    ad.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ad);
        }
    });
};


/**
 * Delete an ad
 */
exports.delete = function (req, res) {
    var ad = req.ad;

    ad.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ad);
        }
    });
};

/**
 * List of Ads
 */
exports.list = function (req, res) {
    Ad.find().sort('-created').populate('user', 'displayName').exec(function (err, ads) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ads);
        }
    });
};

/**
 * List of list By StoreId
 */
exports.listByStoreId = function (req, res) {
    Ad.find({ "store": req.params.storeId, 'todate': { $gte: Date(new Date()) } }).sort('-created').populate('user', 'displayName').exec(function (err, ads) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ads);
        }
    });
};

/**
 * List of list By OutletId
 */
exports.listByOutletId = function (req, res) {
    Ad.find({ "outlets": { $in: [req.params.outletId] }, 'todate': { $gte: Date(new Date()) } }).sort('-created').populate('user', 'displayName').exec(function (err, ads) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ads);
        }
    });
};
/**
 * List of today's Ads
 */
exports.todayslist = function (req, res) {
    Ad.find({ "cities": { $in: [req.params.cityId] }, "ispublished": true, 'todate': { $gte: Date(new Date()) } }).sort('-created').populate('user', 'displayName').exec(function (err, ads) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(ads);
        }
    });
};
/**
 * Ad middleware
 */
exports.adByID = function (req, res, next, id) {
    Ad.findById(id).populate('user', 'displayName').exec(function (err, ad) {
        if (err) return next(err);
        if (!ad) return next(new Error('Failed to load ad ' + id));
        req.ad = ad;
        next();
    });
};

/**
 * Ad authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.roles.indexOf("admin") === 0 || req.user.roles.indexOf("storeadmin") === 0 || req.user.roles.indexOf("outletadmin") === 0) {
        next();
    }
    else {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
};