'use strict';

angular.module('responses').controller('ResponsesController', ['$scope', '$stateParams', '$location', '$filter', 'Authentication', 'Responses', 'Projects', 'Questions', '$modal', '$log',
	function($scope, $stateParams, $location, $filter, Authentication, Responses, Projects, Questions, $modal, $log) {
		$scope.authentication = Authentication;

		var orderBy = $filter('orderBy');

		$scope.order = function(array, predicate, reverse) {
	    	var sorted = orderBy(array, predicate, reverse);
	    	return sorted;
	  	};

	  	$scope.templates = [
			{ name: 'slider_template.html', url: 'modules/responses/views/slider_template.html' },
	        { name: 'radio_template.html', url: 'modules/responses/views/radio_template.html' },
	        { name: 'radio-vertical_template.html', url: 'modules/responses/views/radio-vertical_template.html' },
	        { name: 'sources_template.html', url: 'modules/responses/views/sources_template.html' },
	        { name: 'kpi_template.html', url: 'modules/responses/views/kpi_template.html' }
		];

		$scope.getQuestion = function() {
			$scope.projectId = $stateParams.projectId;
			Questions.query(function(questions){
				
				$scope.questions = {};

				angular.forEach(questions, function(value, key){
					$scope.questions[value.question_id] = value;
				});

				console.log($scope.questions);

				$scope.count = 0;

				Responses.query(function(responses){
					responses = $scope.order(responses, '-projectId', true);

					var savedResponseIndex = 0;
					var savedSequence = 0;
					var nextQuestion;

					$scope.responses = {};

					angular.forEach(responses, function(value, key){
						$scope.responses[value.questionId] = value;
						savedResponseIndex++;
						if (value.sequence > savedSequence){
							savedSequence = value.sequence;
							nextQuestion = value.response;
						}
					});

					console.log(savedResponseIndex);
					console.log($stateParams.projectId);
					console.log($scope.responses);

					Projects.get({
						projectId: $stateParams.projectId
					}).$promise.then(function(project){
						console.log(project);

						$scope.project = project;

						var startId;

						switch(project.type){
							case 'etl':
								startId = 1;
								break;
							case 'vie':
								startId = 301;
								break;
							default:
								startId = '';
								break;
						}

						if (savedResponseIndex > 0){
							// go to next available question

							$scope.count = savedResponseIndex;
							
							console.log($scope.setCount);

							$scope.question = $scope.questions[nextQuestion];

							if ($scope.question.type === 'rating'){
								$scope.template = $scope.templates[0];
							} else if ($scope.question.type === 'binary'){
								$scope.template = $scope.templates[1];
							}
							
						} else {
							// no saved nodes, go to the first question

							

								$scope.question = $scope.questions[startId];
								$scope.question.show_1 = $scope.question.response_1 === '' ? false : true;
								$scope.question.show_2 = $scope.question.response_2 === '' ? false : true;
								$scope.question.show_3 = $scope.question.response_3 === '' ? false : true;

								console.log(startId);
								console.log($scope.questions[startId]);

								console.log($scope.question);

		    					$scope.template = $scope.templates[1]; // horizontal radio button template
		    				
						}
					});
				});
			});
		};

		$scope.next = function(result){
			console.log(result);
			console.log($scope.question.type);

			$scope.count++;

			var response = new Responses({
				projectId: $scope.projectId,
				questionId: $scope.question.question_id,
				response: result,
				question: $scope.question.question,
				type: $scope.question.type,
				sequence: $scope.count
			});

			response.$save(function(response) {
				$scope.score = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			$scope.question = $scope.questions[result];
			$scope.question.show_1 = $scope.question.response_1 === '' ? false : true;
			$scope.question.show_2 = $scope.question.response_2 === '' ? false : true;
			$scope.question.show_3 = $scope.question.response_3 === '' ? false : true;
		};

		$scope.showDatapoints = function(id) {
			console.log(id);
			angular.forEach($scope.indicators, function(value, key){
				if (value._id === id){
					$scope.datapoints = value;
				}
			});
			console.log($scope.datapoints);
		};

		$scope.getList = function() {
			Responses.query(function(responses){
				var array = [];
				var scores = {};
				$scope.surveyId = $stateParams.surveyId;
				angular.forEach(responses, function(value, key){
					if (value.surveyId === $scope.surveyId){
						array.push(value);	
					}
				});
				$scope.responses = array;
				$scope.attributes = $scope.score(array);
			});
		};

		$scope.score = function(array){
			var composite = {};
			angular.forEach(array, function(response, key){
				if (response.score < 0){
					angular.forEach(response.pair1, function(value, key){
						if (!composite[key + ':' + value]){
							composite[key + ':' + value] = {attr: key + ':' + value, aggScore: Math.abs(Number(response.score))};
						} else {
							var aggScore = Number(composite[key + ':' + value].aggScore) +  Math.abs(Number(response.score));
							composite[key + ':' + value] = {attr: key + ':' + value, aggScore: aggScore};
						}
					});
				} else if (response.score > 0){
					angular.forEach(response.pair2, function(value, key){
						if (!composite[key + ':' + value]){
							composite[key + ':' + value] = {attr: key + ':' + value, aggScore: Math.abs(Number(response.score))};
						} else {
							var aggScore = Number(composite[key + ':' + value].aggScore) +  Math.abs(Number(response.score));
							composite[key + ':' + value] = {attr: key + ':' + value, aggScore: aggScore};
						}
					});
				}
			});

			return composite;
		};

		$scope.showDatapoints = function(id) {
			$scope.question.hide.components = false;

			angular.forEach($scope.indicatorsQuestion, function(value, key){
				if (value._id === id){
					$scope.question.numerators = value.numerators;
					$scope.question.denominators = value.denominators;
				}
			});
		};

		$scope.sourceData = {};

		$scope.isSelected = function(id){
	    	var selected = false;
	    	for(var i=0 ; i < $scope.sourceData.length; i++) {
	        	if($scope.sourceData[id]){
	    			selected = true;
	    		}
	    	}
	    	return selected;
	  	};

	  	$scope.sync = function(selection, source){
		    console.log(selection);
		    console.log(source);
		    $scope.sourceData[selection] = source;

			console.log($scope.sourceData);
		};

		$scope.items = ['item1', 'item2', 'item3'];

		$scope.open = function (size) {
		    var modalInstance = $modal.open({
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				size: size,
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
		    });

		    modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
		    }, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};
	}
]);

angular.module('responses').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {
	$scope.items = items;
	$scope.selected = {
		item: $scope.items[0]
	};

	$scope.ok = function () {
		$modalInstance.close($scope.selected.item);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});