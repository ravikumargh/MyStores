'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Image = mongoose.model('Image'),
	_ = require('lodash'),
	fs = require('fs');


/**
 * Create a image
 */
exports.create = function(req, res) {
	var file = req.files.file;
    var tempfile = file.path;
    var origname = file.originalFilename;
    var type = file.type;
    
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    var conn = mongoose.connection;
    var gfs = Grid(conn.db);
    var writestream = gfs.createWriteStream({ filename: origname });

    // open a stream to the temporary file created by Express...
    fs.createReadStream(tempfile)
      .on('end', function () {
          var fileId = writestream.id;
          var call = {
              'contentid': req.body.contentid,
              'imageid': fileId
          };
          Image.create(call, function (err, file) {
              if (err) { return handleError(res, err); }
              return res.status(200).json(file);
          });
      })
      .on('error', function () {
          return handleError(res, new Error("Error uploading file"));
      })
    // and pipe it to gfs
    .pipe(writestream);
};

/**
 * Get a single File by contentid
 *
 * @param req
 * @param res
 */
 var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
exports.show = function (req, res) {
    try {
    	Image.find({ "contentid": req.params.contentId}).exec(function(err, image) {
			 if (err) { return handleError(res, err); }
        if (!image.length) { return res.status(404).end(); }
        //return res.status(200).json(image);
				if (image.length) {					
			        var Grid = require('gridfs-stream');
			        Grid.mongo = mongoose.mongo;
			        var conn = mongoose.connection;
			        var gfs = Grid(conn.db);
			        var options = { _id: image[0].imageid };
			        gfs.createReadStream(options).pipe(res);  
				};
	        }    
		);
    } catch (err) {
        return handleError(res, err);
    }
};

/**
 * Show the current image
 */
exports.read = function(req, res) {
	res.json(req.image);
	// var Grid = require('gridfs-stream');
 //    Grid.mongo = mongoose.mongo;
 //    var conn = mongoose.connection;
 //    var gfs = Grid(conn.db);
 //    var options = { _id: req.params.imageId };
 //    gfs.createReadStream(options).pipe(res);  
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
		var Grid = require('gridfs-stream');
        Grid.mongo = mongoose.mongo;
        var conn = mongoose.connection;
        var gfs = Grid(conn.db);
         
        gfs.remove(req.image[0].imageid.toString())

		//res.json(req);

	// image.remove(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.json(image);
	// 	}
	// });
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
	Image.find({'contentid':id}).exec(function(err, image) {
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