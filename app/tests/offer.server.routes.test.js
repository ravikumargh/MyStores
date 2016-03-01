'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Offer = mongoose.model('Offer'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, offer;

/**
 * Offer routes tests
 */
describe('Offer CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new offer
		user.save(function() {
			offer = {
				title: 'Offer Title',
				content: 'Offer Content'
			};

			done();
		});
	});

	it('should be able to save an offer if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new offer
				agent.post('/offers')
					.send(offer)
					.expect(200)
					.end(function(offerSaveErr, offerSaveRes) {
						// Handle offer save error
						if (offerSaveErr) done(offerSaveErr);

						// Get a list of offers
						agent.get('/offers')
							.end(function(offersGetErr, offersGetRes) {
								// Handle offer save error
								if (offersGetErr) done(offersGetErr);

								// Get offers list
								var offers = offersGetRes.body;

								// Set assertions
								(offers[0].user._id).should.equal(userId);
								(offers[0].title).should.match('Offer Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an offer if not logged in', function(done) {
		agent.post('/offers')
			.send(offer)
			.expect(401)
			.end(function(offerSaveErr, offerSaveRes) {
				// Call the assertion callback
				done(offerSaveErr);
			});
	});

	it('should not be able to save an offer if no title is provided', function(done) {
		// Invalidate title field
		offer.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new offer
				agent.post('/offers')
					.send(offer)
					.expect(400)
					.end(function(offerSaveErr, offerSaveRes) {
						// Set message assertion
						(offerSaveRes.body.message).should.match('Title cannot be blank');
						
						// Handle offer save error
						done(offerSaveErr);
					});
			});
	});

	it('should be able to update an offer if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new offer
				agent.post('/offers')
					.send(offer)
					.expect(200)
					.end(function(offerSaveErr, offerSaveRes) {
						// Handle offer save error
						if (offerSaveErr) done(offerSaveErr);

						// Update offer title
						offer.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing offer
						agent.put('/offers/' + offerSaveRes.body._id)
							.send(offer)
							.expect(200)
							.end(function(offerUpdateErr, offerUpdateRes) {
								// Handle offer update error
								if (offerUpdateErr) done(offerUpdateErr);

								// Set assertions
								(offerUpdateRes.body._id).should.equal(offerSaveRes.body._id);
								(offerUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of offers if not signed in', function(done) {
		// Create new offer model instance
		var offerObj = new Offer(offer);

		// Save the offer
		offerObj.save(function() {
			// Request offers
			request(app).get('/offers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single offer if not signed in', function(done) {
		// Create new offer model instance
		var offerObj = new Offer(offer);

		// Save the offer
		offerObj.save(function() {
			request(app).get('/offers/' + offerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', offer.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an offer if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new offer
				agent.post('/offers')
					.send(offer)
					.expect(200)
					.end(function(offerSaveErr, offerSaveRes) {
						// Handle offer save error
						if (offerSaveErr) done(offerSaveErr);

						// Delete an existing offer
						agent.delete('/offers/' + offerSaveRes.body._id)
							.send(offer)
							.expect(200)
							.end(function(offerDeleteErr, offerDeleteRes) {
								// Handle offer error error
								if (offerDeleteErr) done(offerDeleteErr);

								// Set assertions
								(offerDeleteRes.body._id).should.equal(offerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an offer if not signed in', function(done) {
		// Set offer user 
		offer.user = user;

		// Create new offer model instance
		var offerObj = new Offer(offer);

		// Save the offer
		offerObj.save(function() {
			// Try deleting offer
			request(app).delete('/offers/' + offerObj._id)
			.expect(401)
			.end(function(offerDeleteErr, offerDeleteRes) {
				// Set message assertion
				(offerDeleteRes.body.message).should.match('User is not logged in');

				// Handle offer error error
				done(offerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Offer.remove().exec();
		done();
	});
});