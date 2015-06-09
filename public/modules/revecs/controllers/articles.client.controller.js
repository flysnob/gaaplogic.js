'use strict';

// Revrecs controller
angular.module('revrecs').controller('RevrecsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Revrecs',
	function($scope, $stateParams, $location, Authentication, Revrecs) {
		$scope.authentication = Authentication;

		// Create new Revrec
		$scope.create = function() {
			// Create new Revrec object
			var revrec = new Revrecs({
				title: this.title,
				content: this.content
			});

			// Redirect after save
			revrec.$save(function(response) {
				$location.path('revrecs/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Revrec
		$scope.remove = function(revrec) {
			if (revrec) {
				revrec.$remove();

				for (var i in $scope.revrecs) {
					if ($scope.revrecs[i] === revrec) {
						$scope.revrecs.splice(i, 1);
					}
				}
			} else {
				$scope.revrec.$remove(function() {
					$location.path('revrecs');
				});
			}
		};

		// Update existing Revrec
		$scope.update = function() {
			var revrec = $scope.revrec;

			revrec.$update(function() {
				$location.path('revrecs/' + revrec._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Revrecs
		$scope.find = function() {
			$scope.revrecs = Revrecs.query();
		};

		// Find existing Revrec
		$scope.findOne = function() {
			$scope.revrec = Revrecs.get({
				revrecId: $stateParams.revrecId
			});
		};
	}
]);