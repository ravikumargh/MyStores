
'use strict';

(function() {
	// Categories Controller Spec
	describe('CategoriesController', function() {
		// Initialize global variables
		var CategoriesController,
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

			// Initialize the Categories controller.
			CategoriesController = $controller('CategoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one category object fetched from XHR', inject(function(Categories) {
			// Create sample category using the Categories service
			var sampleCategory = new Categories({
				name: 'An Category about MEAN',
				state: 'MEAN rocks!'
			});

			// Create a sample categories array that includes the new category
			var sampleCategories = [sampleCategory];

			// Set GET response
			$httpBackend.expectGET('categories').respond(sampleCategories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.categories).toEqualData(sampleCategories);
		}));

		it('$scope.findOne() should create an array with one category object fetched from XHR using a categoryId URL parameter', inject(function(Categories) {
			// Define a sample category object
			var sampleCategory = new Categories({
				name: 'An Category about MEAN',
				state: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.categoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/categories\/([0-9a-fA-F]{24})$/).respond(sampleCategory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.category).toEqualData(sampleCategory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Categories) {
			// Create a sample category object
			var sampleCategoryPostData = new Categories({
				name: 'An Category about MEAN',
				state: 'MEAN rocks!'
			});

			// Create a sample category response
			var sampleCategoryResponse = new Categories({
				_id: '525cf20451979dea2c000001',
				name: 'An Category about MEAN',
				state: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.name = 'An Category about MEAN';
			scope.state = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('categories', sampleCategoryPostData).respond(sampleCategoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');
			expect(scope.state).toEqual('');

			// Test URL redirection after the category was created
			expect($location.path()).toBe('/categories/' + sampleCategoryResponse._id);
		}));

		it('$scope.update() should update a valid category', inject(function(Categories) {
			// Define a sample category put data
			var sampleCategoryPutData = new Categories({
				_id: '525cf20451979dea2c000001',
				name: 'An Category about MEAN',
				state: 'MEAN Rocks!'
			});

			// Mock category in scope
			scope.category = sampleCategoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/categories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/categories/' + sampleCategoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid categoryId and remove the category from the scope', inject(function(Categories) {
			// Create new category object
			var sampleCategory = new Categories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new categories array and include the category
			scope.categories = [sampleCategory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/categories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCategory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.categories.length).toBe(0);
		}));
	});
}());