'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Outlet Schema
 */
var OutletSchema = new Schema({
    name: {
        type: String,
        default: '',
        trim: true,
        required: 'Name cannot be blank'
    },
    address: {
        name: {
            type: String,
            default: '',
            trim: true,
            required: 'Address cannot be blank'
        },
        place: String,
        components: {
            placeId: String,
            streetNumber: String,
            street: String,
            city: String,
            state: String,
            countryCode: String,
            country: String,
            postCode: String,
            district: String,
            location: {
                lat: String,
                long: String
            }
        }
    },
    landmark: {
        type: String,
        trim: true
    },
    city: {
        type: Schema.ObjectId,
        ref: 'City'
    },
    store: {
        type: Schema.ObjectId,
        ref: 'Store'
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

mongoose.model('Outlet', OutletSchema);