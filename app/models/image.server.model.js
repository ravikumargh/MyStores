'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Image Schema
 */
var ImageSchema = new Schema({	
	imageid: Schema.ObjectId,	
	contentid: Schema.ObjectId,	 
	store: {
		type: Schema.ObjectId,
		ref: 'Store'
	},
	outlet: {
		type: Schema.ObjectId,
		ref: 'Outlet'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},		
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	isdeleted: {
		type: Boolean,
		default: 0
	}
});

mongoose.model('Image', ImageSchema);