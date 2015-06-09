'use strict';

(function() {
	// Revrecs Controller Spec
	describe('Revrecs Controller Tests', function() {
		// Initialize global variables
		var RevrecsController,
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

			// Initialize the Revrecs controller.
			RevrecsController = $controller('RevrecsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one revrec object fetched from XHR', inject(function(Revrecs) {
			// Create sample revrec using the Revrecs service
			var sampleRevrec = new Revrecs({
				title: 'An Revrec about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample revrecs array that includes the new revrec
			var sampleRevrecs = [sampleRevrec];

			// Set GET response
			$httpBackend.expectGET('revrecs').respond(sampleRevrecs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.revrecs).toEqualData(sampleRevrecs);
		}));

		it('$scope.findOne() should create an array with one revrec object fetched from XHR using a revrecId URL parameter', inject(function(Revrecs) {
			// Define a sample revrec object
			var sampleRevrec = new Revrecs({
				title: 'An Revrec about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.revrecId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/revrecs\/([0-9a-fA-F]{24})$/).respond(sampleRevrec);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.revrec).toEqualData(sampleRevrec);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Revrecs) {
			// Create a sample revrec object
			var sampleRevrecPostData = new Revrecs({
				title: 'An Revrec about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample revrec response
			var sampleRevrecResponse = new Revrecs({
				_id: '525cf20451979dea2c000001',
				title: 'An Revrec about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Revrec about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('revrecs', sampleRevrecPostData).respond(sampleRevrecResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the revrec was created
			expect($location.path()).toBe('/revrecs/' + sampleRevrecResponse._id);
		}));

		it('$scope.update() should update a valid revrec', inject(function(Revrecs) {
			// Define a sample revrec put data
			var sampleRevrecPutData = new Revrecs({
				_id: '525cf20451979dea2c000001',
				title: 'An Revrec about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock revrec in scope
			scope.revrec = sampleRevrecPutData;

			// Set PUT response
			$httpBackend.expectPUT(/revrecs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/revrecs/' + sampleRevrecPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid revrecId and remove the revrec from the scope', inject(function(Revrecs) {
			// Create new revrec object
			var sampleRevrec = new Revrecs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new revrecs array and include the revrec
			scope.revrecs = [sampleRevrec];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/revrecs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRevrec);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.revrecs.length).toBe(0);
		}));
	});
}());