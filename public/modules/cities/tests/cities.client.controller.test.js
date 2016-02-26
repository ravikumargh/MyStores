
'use strict';

(function() {
	// Cities Controller Spec
	describe('CitiesController', function() {
		// Initialize global variables
		var CitiesController,
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

			// Initialize the Cities controller.
			CitiesController = $controller('CitiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one city object fetched from XHR', inject(function(Cities) {
			// Create sample city using the Cities service
			var sampleCity = new Cities({
				name: 'An City about MEAN',
				state: 'MEAN rocks!'
			});

			// Create a sample cities array that includes the new city
			var sampleCities = [sampleCity];

			// Set GET response
			$httpBackend.expectGET('cities').respond(sampleCities);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cities).toEqualData(sampleCities);
		}));

		it('$scope.findOne() should create an array with one city object fetched from XHR using a cityId URL parameter', inject(function(Cities) {
			// Define a sample city object
			var sampleCity = new Cities({
				name: 'An City about MEAN',
				state: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.cityId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/cities\/([0-9a-fA-F]{24})$/).respond(sampleCity);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.city).toEqualData(sampleCity);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Cities) {
			// Create a sample city object
			var sampleCityPostData = new Cities({
				name: 'An City about MEAN',
				state: 'MEAN rocks!'
			});

			// Create a sample city response
			var sampleCityResponse = new Cities({
				_id: '525cf20451979dea2c000001',
				name: 'An City about MEAN',
				state: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.name = 'An City about MEAN';
			scope.state = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('cities', sampleCityPostData).respond(sampleCityResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.state).toEqual('');

			// Test URL redirection after the city was created
			expect($location.path()).toBe('/cities/' + sampleCityResponse._id);
		}));

		it('$scope.update() should update a valid city', inject(function(Cities) {
			// Define a sample city put data
			var sampleCityPutData = new Cities({
				_id: '525cf20451979dea2c000001',
				name: 'An City about MEAN',
				state: 'MEAN Rocks!'
			});

			// Mock city in scope
			scope.city = sampleCityPutData;

			// Set PUT response
			$httpBackend.expectPUT(/cities\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/cities/' + sampleCityPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cityId and remove the city from the scope', inject(function(Cities) {
			// Create new city object
			var sampleCity = new Cities({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new cities array and include the city
			scope.cities = [sampleCity];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/cities\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCity);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.cities.length).toBe(0);
		}));
	});
}());