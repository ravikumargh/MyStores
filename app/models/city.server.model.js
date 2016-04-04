'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * City Schema
 */
var CitySchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	}, 
	place_id : String,
	formatted_address : String,
	location : {
            lat : String,
            lng : String
         },
	created: {
		type: Date,
		default: Date.now
	}

});

mongoose.model('City', CitySchema);