angular.module('liteTech.controller', ['liteTech.service'])
.controller("appController", ['$scope','$http','liteTechService','$ionicPopup','$timeout','$state', function($scope,$http,liteTechService,$ionicPopup,$timeout,$state){

	$scope.residence = {};
	$scope.selections = {};
	$scope.validateMsg = '';
	$scope.fixtures = 0;
	$scope.currentAvgFlux = 0;
	$scope.optimumFlux = 250;
	$scope.fixtureFlux = 0;
	$scope.luminenSet = [];
	 
	liteTechService.getResidence().then(function(response){
		$scope.residence.data = response.data;
		for(x in $scope.residence.data){
			$scope.residence.data[x].selected = false;
		}
		console.log($scope.residence.data[0]);
	}, function(response){
		$scope.validateMsg = 'Failed to fetch residence data !!!';
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
	        	for(x in $scope.residence.data){
					if($scope.residence.data[x].model_no === rd.model_no){
						$scope.residence.data[x].selected = true;
					}else{
						$scope.residence.data[x].selected = false;
					}
				}
	        }
	      }
	    ]
	  });
	};

	$scope.popupClose = function (){
		myPopup.close();
	};

	$scope.getLuminen = function(){
		var lightOutput = '';
		for(data in $scope.residence.data){
			if($scope.residence.data[data].model_no === $scope.selections.model){
				lightOutput = $scope.residence.data[data].light_output;
			}
		}
		$scope.luminenSet = lightOutput.split('/');
	}

	$scope.calculateFlux = function(color){
		var flength = ($scope.selections.length/3.28) * 0.75;
		var fwidth = ($scope.selections.width/3.28) * 0.75;
		var luminen = parseInt($scope.luminenSet[color]);
		var fixture = ($scope.optimumFlux * flength * fwidth) / (0.63 * 0.69 * luminen);
		$scope.fixtures = Math.round(fixture);
		$scope.fixtureFlux = $scope.optimumFlux/$scope.fixtures;
		$scope.currentAvgFlux = $scope.optimumFlux;
	};

	$scope.validate = function (){
		if($scope.selections.length === '' || $scope.selections.length === undefined || $scope.selections.width === '' || $scope.selections.width === undefined || $scope.selections.height === '' || $scope.selections.height === undefined || $scope.selections.model === '' || $scope.selections.model === undefined){
			$scope.validateMsg = 'Please provide the area of room and also select any one light !!!';
		}else{
			$scope.getLuminen();
			$scope.calculateFlux(0);
			$state.go('result');
		}
	};

	$scope.increaseFixture = function(){
		$scope.fixtures = $scope.fixtures + 1;
		$scope.currentAvgFlux = Math.round($scope.fixtureFlux*$scope.fixtures);
	};

	$scope.decreaseFixture = function(){
		$scope.fixtures = $scope.fixtures - 1;
		$scope.currentAvgFlux = Math.round($scope.fixtureFlux*$scope.fixtures);
	};

}]);