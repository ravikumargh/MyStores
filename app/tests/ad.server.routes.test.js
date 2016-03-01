'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ad = mongoose.model('Ad'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, ad;

/**
 * Ad routes tests
 */
describe('Ad CRUD tests', function() {
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

		// Save a user to the test db and create new ad
		user.save(function() {
			ad = {
				title: 'Ad Title',
				content: 'Ad Content'
			};

			done();
		});
	});

	it('should be able to save an ad if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new ad
				agent.post('/ads')
					.send(ad)
					.expect(200)
					.end(function(adSaveErr, adSaveRes) {
						// Handle ad save error
						if (adSaveErr) done(adSaveErr);

						// Get a list of ads
						agent.get('/ads')
							.end(function(adsGetErr, adsGetRes) {
								// Handle ad save error
								if (adsGetErr) done(adsGetErr);

								// Get ads list
								var ads = adsGetRes.body;

								// Set assertions
								(ads[0].user._id).should.equal(userId);
								(ads[0].title).should.match('Ad Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an ad if not logged in', function(done) {
		agent.post('/ads')
			.send(ad)
			.expect(401)
			.end(function(adSaveErr, adSaveRes) {
				// Call the assertion callback
				done(adSaveErr);
			});
	});

	it('should not be able to save an ad if no title is provided', function(done) {
		// Invalidate title field
		ad.title = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new ad
				agent.post('/ads')
					.send(ad)
					.expect(400)
					.end(function(adSaveErr, adSaveRes) {
						// Set message assertion
						(adSaveRes.body.message).should.match('Title cannot be blank');
						
						// Handle ad save error
						done(adSaveErr);
					});
			});
	});

	it('should be able to update an ad if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new ad
				agent.post('/ads')
					.send(ad)
					.expect(200)
					.end(function(adSaveErr, adSaveRes) {
						// Handle ad save error
						if (adSaveErr) done(adSaveErr);

						// Update ad title
						ad.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing ad
						agent.put('/ads/' + adSaveRes.body._id)
							.send(ad)
							.expect(200)
							.end(function(adUpdateErr, adUpdateRes) {
								// Handle ad update error
								if (adUpdateErr) done(adUpdateErr);

								// Set assertions
								(adUpdateRes.body._id).should.equal(adSaveRes.body._id);
								(adUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of ads if not signed in', function(done) {
		// Create new ad model instance
		var adObj = new Ad(ad);

		// Save the ad
		adObj.save(function() {
			// Request ads
			request(app).get('/ads')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single ad if not signed in', function(done) {
		// Create new ad model instance
		var adObj = new Ad(ad);

		// Save the ad
		adObj.save(function() {
			request(app).get('/ads/' + adObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', ad.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an ad if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new ad
				agent.post('/ads')
					.send(ad)
					.expect(200)
					.end(function(adSaveErr, adSaveRes) {
						// Handle ad save error
						if (adSaveErr) done(adSaveErr);

						// Delete an existing ad
						agent.delete('/ads/' + adSaveRes.body._id)
							.send(ad)
							.expect(200)
							.end(function(adDeleteErr, adDeleteRes) {
								// Handle ad error error
								if (adDeleteErr) done(adDeleteErr);

								// Set assertions
								(adDeleteRes.body._id).should.equal(adSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an ad if not signed in', function(done) {
		// Set ad user 
		ad.user = user;

		// Create new ad model instance
		var adObj = new Ad(ad);

		// Save the ad
		adObj.save(function() {
			// Try deleting ad
			request(app).delete('/ads/' + adObj._id)
			.expect(401)
			.end(function(adDeleteErr, adDeleteRes) {
				// Set message assertion
				(adDeleteRes.body.message).should.match('User is not logged in');

				// Handle ad error error
				done(adDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Ad.remove().exec();
		done();
	});
});