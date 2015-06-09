'use strict';

// Setting up route
angular.module('revrecs').config(['$stateProvider',
	function($stateProvider) {
		// Revrecs state routing
		$stateProvider.
		state('listRevrecs', {
			url: '/revrecs',
			templateUrl: 'modules/revrecs/views/list-revrecs.client.view.html'
		}).
		state('createRevrec', {
			url: '/revrecs/create',
			templateUrl: 'modules/revrecs/views/create-revrec.client.view.html'
		}).
		state('viewRevrec', {
			url: '/revrecs/:revrecId',
			templateUrl: 'modules/revrecs/views/view-revrec.client.view.html'
		}).
		state('editRevrec', {
			url: '/revrecs/:revrecId/edit',
			templateUrl: 'modules/revrecs/views/edit-revrec.client.view.html'
		});
	}
]);