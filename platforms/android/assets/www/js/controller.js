angular.module('liteTech.controller', ['liteTech.service'])
.controller("appController", ['$scope','$http','liteTechService','$ionicPopup','$timeout', function($scope,$http,liteTechService,$ionicPopup,$timeout){

	$scope.residence = {};
	$scope.selections = {};
	 
	liteTechService.getResidence().then(function(response){
		$scope.residence.data = response.data;
	}, function(response){
		console.error("Failed to fetch residence data");
	});

	$scope.showPopup = function(rd){
	  var myPopup = $ionicPopup.show({
	    template: '<div class="popup-wrapper"><a class="close-popup" ng-click="popupClose()">X</a><img src="'+rd.img_url+'" alt="'+rd.model_no+'"></div>',
	    // title: rd.model_no,
	    scope: $scope,
	    buttons: [
	      {
	        text: '<b>Select</b>',
	        type: 'button-balanced',
	        onTap: function(e) {
	          $scope.selections.model = rd.model_no;
	        }
	      }
	    ]
	  });

	};


	$scope.popupClose = function (){
		console.log('close');
	};

	$scope.selections.calculate = function (){
		// console.log($scope.selections);
	}




}]);