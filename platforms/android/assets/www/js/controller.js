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
	  myPopup = $ionicPopup.show({
	    template: '<div class="popup-wrapper"><a class="close-popup" ng-click="popupClose()">X</a><p class="popup-title">'+rd.model_no+'<span>('+rd.category+')</span></p><img src="'+rd.img_url+'" alt="'+rd.model_no+'"><div class="row"><div class="col-title">Input Power</div><div class="col-data">'+rd.input_power+' W</div></div><div class="row"><div class="col-title">Input Voltage</div><div class="col-data">'+rd.input_voltage+' V</div></div><div class="row"><div class="col-title">Driver Efficiency</div><div class="col-data">>'+rd.driver_efficiency+'%</div></div><div class="row"><div class="col-title">Color</div><div class="col-data">'+rd.color+'</div></div><div class="row"><div class="col-title">CRI</div><div class="col-data">'+rd.cri+'</div></div><div class="row"><div class="col-title">Light Output</div><div class="col-data">'+rd.light_output+'</div></div></div>',
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
		myPopup.close();
	};

	$scope.selections.calculate = function (){
		
	}

}]);