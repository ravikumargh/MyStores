'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Store Schema
 */
var StoreSchema = new Schema({	
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	address: {
		type: String,
		default: '',
		trim: true,
		required: 'Address cannot be blank'
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
	}
});

mongoose.model('Store', StoreSchema);