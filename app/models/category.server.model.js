'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Category Schema
 */
var CategorySchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	sequence: {
		type: Number,
		default: 0		
	},
	cssclass: {
		type: String,
		default: '',
		trim: true
	},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin','storeadmin','outletadmin']
		}],
		default: ['admin']
	},
	parentid: {
		type: Schema.ObjectId,
		ref: 'Category'
	}
});

mongoose.model('Category', CategorySchema);