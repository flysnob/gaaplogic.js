'use strict';

// Setting up route
angular.module('responses').config(['$stateProvider',
	function($stateProvider) {
		// Responses state routing
		$stateProvider.	
		state('createResponse', {
			url: '/responses/create/:projectId',
			templateUrl: 'modules/responses/views/create-response.client.view.html',
			controller: function($stateParams){
				$stateParams.projectId;
			}
		}).
		state('listResponses', {
			url: '/responses/:projectId',
			templateUrl: 'modules/responses/views/list-responses.client.view.html'
		}).
		state('evaluateResponses', {
			url: '/responses/evaluate/:sortableId',
			templateUrl: 'modules/responses/views/evaluate-responses.client.view.html',
			controller: function($stateParams){
				$stateParams.sortableId;
			}
		}).
		state('editResponses', {
			url: '/responses/edit/:sortableId',
			templateUrl: 'modules/responses/views/edit-responses.client.view.html',
			controller: function($stateParams){
				$stateParams.sortableId;
			}
		});
	}
]);