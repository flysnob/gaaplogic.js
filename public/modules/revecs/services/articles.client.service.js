'use strict';

//Revrecs service used for communicating with the revrecs REST endpoints
angular.module('revrecs').factory('Revrecs', ['$resource',
	function($resource) {
		return $resource('revrecs/:revrecId', {
			revrecId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);