'use strict';

(function() {
	// Offers Controller Spec
	describe('OffersController', function() {
		// Initialize global variables
		var OffersController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Offers controller.
			OffersController = $controller('OffersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one offer object fetched from XHR', inject(function(Offers) {
			// Create sample offer using the Offers service
			var sampleOffer = new Offers({
				title: 'An Offer about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample offers array that includes the new offer
			var sampleOffers = [sampleOffer];

			// Set GET response
			$httpBackend.expectGET('offers').respond(sampleOffers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.offers).toEqualData(sampleOffers);
		}));

		it('$scope.findOne() should create an array with one offer object fetched from XHR using a offerId URL parameter', inject(function(Offers) {
			// Define a sample offer object
			var sampleOffer = new Offers({
				title: 'An Offer about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.offerId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/offers\/([0-9a-fA-F]{24})$/).respond(sampleOffer);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.offer).toEqualData(sampleOffer);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Offers) {
			// Create a sample offer object
			var sampleOfferPostData = new Offers({
				title: 'An Offer about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample offer response
			var sampleOfferResponse = new Offers({
				_id: '525cf20451979dea2c000001',
				title: 'An Offer about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Offer about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('offers', sampleOfferPostData).respond(sampleOfferResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the offer was created
			expect($location.path()).toBe('/offers/' + sampleOfferResponse._id);
		}));

		it('$scope.update() should update a valid offer', inject(function(Offers) {
			// Define a sample offer put data
			var sampleOfferPutData = new Offers({
				_id: '525cf20451979dea2c000001',
				title: 'An Offer about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock offer in scope
			scope.offer = sampleOfferPutData;

			// Set PUT response
			$httpBackend.expectPUT(/offers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/offers/' + sampleOfferPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid offerId and remove the offer from the scope', inject(function(Offers) {
			// Create new offer object
			var sampleOffer = new Offers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new offers array and include the offer
			scope.offers = [sampleOffer];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/offers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOffer);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.offers.length).toBe(0);
		}));
	});
}());