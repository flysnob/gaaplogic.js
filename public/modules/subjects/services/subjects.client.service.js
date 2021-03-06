'use strict';

//Subjects service used for communicating with the subjects REST endpoints
angular.module('subjects').factory('Subjects', ['$resource',
	function($resource) {
		return $resource('subjects/:subjectId', {
			subjectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);