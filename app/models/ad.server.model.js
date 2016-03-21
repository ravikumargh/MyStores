'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ad Schema
 */
var AdSchema = new Schema({	
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	fromdate: {
		type: Date,
		default: Date.now
	},
	todate: {
		type: Date,
		default: Date.now
	},
	category: {
		type: Schema.ObjectId,
		ref: 'Category'
	},
	stores: {
		type: [{
			type: Schema.ObjectId,
			ref: 'Store'
		}]
	},
	outlets: {
		type: [{
			type: Schema.ObjectId,
			ref: 'Outlet'
		}]
	},
	cities: {
		type: [{
			type: Schema.ObjectId,
			ref: 'City'
		}]
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ispublished: {
		type: Boolean,
		default: 0
	},
	isalloutlets: {
	    type: Boolean,
	    default: 0
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

mongoose.model('Ad', AdSchema);