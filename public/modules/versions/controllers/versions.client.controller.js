'use strict';

angular.module('versions').controller('VersionsController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'Versions', 'Subjects',
	function($scope, $stateParams, $location, $filter, Authentication, Versions, Subjects) {
		$scope.authentication = Authentication;

		var orderBy = $filter('orderBy');

		$scope.order = function(array, predicate, reverse) {
	    	var sorted = orderBy(array, predicate, reverse);
	    	return sorted;
	  	};

	  	$scope.getSubjects = function() {
	  		Subjects.query(function(subjects){
				subjects = $scope.order(subjects, '-name', true);
				$scope.subjects = subjects;
			});
	  	};

		$scope.create = function() {
			console.log(this.versionJson);
			var version = new Versions({
				subject: this.subject,
				description: this.subject.name + ' v' + this.versionId,
				versionId: this.versionId,
				effective: this.effective,
				status: this.status,
				versionCode: this.subject.prefix + '.' + this.versionId,
				versionJson: angular.fromJson(this.versionJson)
			});
			version.$save(function(response) {
				$location.path('versions');

				$scope.subject = '';
				$scope.description = '';
				$scope.versionId = '';
				$scope.effective = '';
				$scope.status = '';
				$scope.versionCode = '';
				$scope.versionJson = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(version) {
			if (version) {
				version.$remove();

				for (var i in $scope.versions) {
					if ($scope.versions[i] === version) {
						$scope.versions.splice(i, 1);
					}
				}
			} else {
				$scope.version.$remove(function() {
					$location.path('versions');
				});
			}
		};

		$scope.update = function() {
			console.log($scope.version.versionJson);
			console.log(angular.fromJson($scope.version.versionJson));
			var version = $scope.version;

			version.versionJson = angular.fromJson($scope.version.versionJson);
			version.versionCode = $scope.version.subject.prefix + '.' + $scope.version.versionId;
			version.description = $scope.version.subject.name + ' v' + $scope.version.versionId;

			version.$update(function() {
				$location.path('versions');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			Versions.query(function(versions){
				versions = $scope.order(versions, '-name', true);
				$scope.versions = versions;
			});
		};

		$scope.findOne = function() {
			Versions.get({
				versionId: $stateParams.versionId
			}).$promise.then(function(version){
				version.versionJson = angular.toJson(version.versionJson);

				$scope.version = version;

				$scope.getSubjects();
			});
		};
	}
]);