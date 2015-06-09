'use strict';

// Setting up route
angular.module('requirements_responses').config(['$stateProvider',
	function($stateProvider) {
		// Responses state routing
		$stateProvider.	
		state('createPreferenceResponse', {
			url: '/requirements_responses/create/preference/:projectId',
			templateUrl: 'modules/requirements_responses/views/create-preference-requirements_response.client.view.html',
			controller: function($stateParams){
				$stateParams.projectId;
			}
		}).
		state('createBinaryResponse', {
			url: '/requirements_responses/create/:projectId',
			templateUrl: 'modules/requirements_responses/views/create-requirements_response.client.view.html',
			controller: function($stateParams){
				$stateParams.projectId;
			}
		}).
		state('listRequirementResponses', {
			url: '/requirements_responses/:projectId',
			templateUrl: 'modules/requirements_responses/views/list-requirements_responses.client.view.html'
		}).
		state('reportRequirementResponses', {
			url: '/requirements_responses/report/:projectId',
			templateUrl: 'modules/requirements_responses/views/report-requirements_response.client.view.html',
		});
	}
]);