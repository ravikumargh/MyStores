'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Offer Schema
 */
var OfferSchema = new Schema({	
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

mongoose.model('Offer', OfferSchema);