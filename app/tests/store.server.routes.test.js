'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Store = mongoose.model('Store'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, store;

/**
 * Store routes tests
 */
describe('Store CRUD tests', function() {
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

		// Save a user to the test db and create new store
		user.save(function() {
			store = {
				name: 'Store Name',
				address: 'Store Address'
			};

			done();
		});
	});

	it('should be able to save an store if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new store
				agent.post('/stores')
					.send(store)
					.expect(200)
					.end(function(storeSaveErr, storeSaveRes) {
						// Handle store save error
						if (storeSaveErr) done(storeSaveErr);

						// Get a list of stores
						agent.get('/stores')
							.end(function(storesGetErr, storesGetRes) {
								// Handle store save error
								if (storesGetErr) done(storesGetErr);

								// Get stores list
								var stores = storesGetRes.body;

								// Set assertions
								(stores[0].user._id).should.equal(userId);
								(stores[0].name).should.match('Store Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an store if not logged in', function(done) {
		agent.post('/stores')
			.send(store)
			.expect(401)
			.end(function(storeSaveErr, storeSaveRes) {
				// Call the assertion callback
				done(storeSaveErr);
			});
	});

	it('should not be able to save an store if no name is provided', function(done) {
		// Invalidate name field
		store.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new store
				agent.post('/stores')
					.send(store)
					.expect(400)
					.end(function(storeSaveErr, storeSaveRes) {
						// Set message assertion
						(storeSaveRes.body.message).should.match('Name cannot be blank');
						
						// Handle store save error
						done(storeSaveErr);
					});
			});
	});

	it('should be able to update an store if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new store
				agent.post('/stores')
					.send(store)
					.expect(200)
					.end(function(storeSaveErr, storeSaveRes) {
						// Handle store save error
						if (storeSaveErr) done(storeSaveErr);

						// Update store name
						store.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing store
						agent.put('/stores/' + storeSaveRes.body._id)
							.send(store)
							.expect(200)
							.end(function(storeUpdateErr, storeUpdateRes) {
								// Handle store update error
								if (storeUpdateErr) done(storeUpdateErr);

								// Set assertions
								(storeUpdateRes.body._id).should.equal(storeSaveRes.body._id);
								(storeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of stores if not signed in', function(done) {
		// Create new store model instance
		var storeObj = new Store(store);

		// Save the store
		storeObj.save(function() {
			// Request stores
			request(app).get('/stores')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single store if not signed in', function(done) {
		// Create new store model instance
		var storeObj = new Store(store);

		// Save the store
		storeObj.save(function() {
			request(app).get('/stores/' + storeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', store.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an store if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new store
				agent.post('/stores')
					.send(store)
					.expect(200)
					.end(function(storeSaveErr, storeSaveRes) {
						// Handle store save error
						if (storeSaveErr) done(storeSaveErr);

						// Delete an existing store
						agent.delete('/stores/' + storeSaveRes.body._id)
							.send(store)
							.expect(200)
							.end(function(storeDeleteErr, storeDeleteRes) {
								// Handle store error error
								if (storeDeleteErr) done(storeDeleteErr);

								// Set assertions
								(storeDeleteRes.body._id).should.equal(storeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an store if not signed in', function(done) {
		// Set store user 
		store.user = user;

		// Create new store model instance
		var storeObj = new Store(store);

		// Save the store
		storeObj.save(function() {
			// Try deleting store
			request(app).delete('/stores/' + storeObj._id)
			.expect(401)
			.end(function(storeDeleteErr, storeDeleteRes) {
				// Set message assertion
				(storeDeleteRes.body.message).should.match('User is not logged in');

				// Handle store error error
				done(storeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Store.remove().exec();
		done();
	});
});