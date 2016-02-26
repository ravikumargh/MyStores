'use strict';

(function() {
	// Outlets Controller Spec
	describe('OutletsController', function() {
		// Initialize global variables
		var OutletsController,
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

			// Initialize the Outlets controller.
			OutletsController = $controller('OutletsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one outlet object fetched from XHR', inject(function(Outlets) {
			// Create sample outlet using the Outlets service
			var sampleOutlet = new Outlets({
				name: 'An Outlet about MEAN',
				address: 'MEAN rocks!'
			});

			// Create a sample outlets array that includes the new outlet
			var sampleOutlets = [sampleOutlet];

			// Set GET response
			$httpBackend.expectGET('outlets').respond(sampleOutlets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.outlets).toEqualData(sampleOutlets);
		}));

		it('$scope.findOne() should create an array with one outlet object fetched from XHR using a outletId URL parameter', inject(function(Outlets) {
			// Define a sample outlet object
			var sampleOutlet = new Outlets({
				name: 'An Outlet about MEAN',
				address: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.outletId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/outlets\/([0-9a-fA-F]{24})$/).respond(sampleOutlet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.outlet).toEqualData(sampleOutlet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Outlets) {
			// Create a sample outlet object
			var sampleOutletPostData = new Outlets({
				name: 'An Outlet about MEAN',
				address: 'MEAN rocks!'
			});

			// Create a sample outlet response
			var sampleOutletResponse = new Outlets({
				_id: '525cf20451979dea2c000001',
				name: 'An Outlet about MEAN',
				address: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.name = 'An Outlet about MEAN';
			scope.address = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('outlets', sampleOutletPostData).respond(sampleOutletResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.address).toEqual('');

			// Test URL redirection after the outlet was created
			expect($location.path()).toBe('/outlets/' + sampleOutletResponse._id);
		}));

		it('$scope.update() should update a valid outlet', inject(function(Outlets) {
			// Define a sample outlet put data
			var sampleOutletPutData = new Outlets({
				_id: '525cf20451979dea2c000001',
				name: 'An Outlet about MEAN',
				address: 'MEAN Rocks!'
			});

			// Mock outlet in scope
			scope.outlet = sampleOutletPutData;

			// Set PUT response
			$httpBackend.expectPUT(/outlets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/outlets/' + sampleOutletPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid outletId and remove the outlet from the scope', inject(function(Outlets) {
			// Create new outlet object
			var sampleOutlet = new Outlets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new outlets array and include the outlet
			scope.outlets = [sampleOutlet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/outlets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOutlet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.outlets.length).toBe(0);
		}));
	});
}());