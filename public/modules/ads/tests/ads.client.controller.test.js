'use strict';

(function() {
	// Ads Controller Spec
	describe('AdsController', function() {
		// Initialize global variables
		var AdsController,
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

			// Initialize the Ads controller.
			AdsController = $controller('AdsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one ad object fetched from XHR', inject(function(Ads) {
			// Create sample ad using the Ads service
			var sampleAd = new Ads({
				title: 'An Ad about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample ads array that includes the new ad
			var sampleAds = [sampleAd];

			// Set GET response
			$httpBackend.expectGET('ads').respond(sampleAds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ads).toEqualData(sampleAds);
		}));

		it('$scope.findOne() should create an array with one ad object fetched from XHR using a adId URL parameter', inject(function(Ads) {
			// Define a sample ad object
			var sampleAd = new Ads({
				title: 'An Ad about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.adId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ads\/([0-9a-fA-F]{24})$/).respond(sampleAd);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ad).toEqualData(sampleAd);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ads) {
			// Create a sample ad object
			var sampleAdPostData = new Ads({
				title: 'An Ad about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample ad response
			var sampleAdResponse = new Ads({
				_id: '525cf20451979dea2c000001',
				title: 'An Ad about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Ad about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('ads', sampleAdPostData).respond(sampleAdResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the ad was created
			expect($location.path()).toBe('/ads/' + sampleAdResponse._id);
		}));

		it('$scope.update() should update a valid ad', inject(function(Ads) {
			// Define a sample ad put data
			var sampleAdPutData = new Ads({
				_id: '525cf20451979dea2c000001',
				title: 'An Ad about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock ad in scope
			scope.ad = sampleAdPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ads\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ads/' + sampleAdPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid adId and remove the ad from the scope', inject(function(Ads) {
			// Create new ad object
			var sampleAd = new Ads({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new ads array and include the ad
			scope.ads = [sampleAd];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ads\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAd);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ads.length).toBe(0);
		}));
	});
}());