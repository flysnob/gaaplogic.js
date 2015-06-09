'use strict';

//Requirments_responses service used for communicating with the requirements_responses REST endpoints
angular.module('requirements_responses').factory('Requirements_responses', ['$resource',
	function($resource) {
		return $resource('requirements_responses/:requirements_responseId', {
			requirements_responseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);