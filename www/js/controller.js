angular.module('liteTech.controller', ['liteTech.service'])
.controller("appController", ['$scope','$http','liteTechService','$ionicPopup','$timeout','$state', function($scope,$http,liteTechService,$ionicPopup,$timeout,$state){

	$scope.residence = {};
	$scope.selections = {};
	$scope.graphData = {};
	$scope.validateMsg = '';
	$scope.fixtures = 0;
	$scope.currentAvgFlux = 0;
	$scope.optimumFlux = 250;
	$scope.fixtureFlux = 0;
	
	liteTechService.getResidence().then(function (response){
		$scope.residence.data = response.data;
		for(x in $scope.residence.data){
			$scope.residence.data[x].selected = false;
		}
	}, function (response){
		$scope.validateMsg = 'Failed to fetch residence data !!!';
	});

	$scope.showPopup = function (rd){
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

	$scope.validate = function (){
		if($scope.selections.length === '' || $scope.selections.length === undefined || $scope.selections.width === '' || $scope.selections.width === undefined || $scope.selections.height === '' || $scope.selections.height === undefined || $scope.selections.model === '' || $scope.selections.model === undefined){
			$scope.validateMsg = 'Please provide the area of room and also select any one light !!!';
		}else{
			$scope.getData();
			$scope.calculateFlux(0);
			$state.go('result');
		}
	};

	$scope.getData = function (){
		var lightOutput = '';
		for(data in $scope.residence.data){
			if($scope.residence.data[data].model_no === $scope.selections.model){
				lightOutput = $scope.residence.data[data].light_output;
			}
		}
		$scope.selections.luminenSet = lightOutput.split('/');
	}

	$scope.calculateFlux = function (color){
		$scope.graphData.color = color;
		$scope.graphData.roomLength = Math.round($scope.selections.length/3.28);
		$scope.graphData.roomWidth = Math.round($scope.selections.width/3.28);
		$scope.graphData.roomHeight = Math.round($scope.selections.height/3.28);
		$scope.graphData.luminen = parseInt($scope.selections.luminenSet[color]);
		$scope.graphData.fixtures = Math.round(($scope.optimumFlux * $scope.graphData.roomLength * $scope.graphData.roomWidth) / (0.63 * 0.69 * $scope.graphData.luminen));				
		$scope.fixtureFlux = $scope.optimumFlux/$scope.graphData.fixtures;
		$scope.currentAvgFlux = $scope.optimumFlux;
    	$scope.plotGraph();
	};

	$scope.increaseFixture = function (){
		$scope.graphData.fixtures = $scope.graphData.fixtures + 1;
		$scope.currentAvgFlux = Math.round($scope.fixtureFlux*$scope.graphData.fixtures);
		$scope.plotGraph();
	};

	$scope.decreaseFixture = function (){
		$scope.graphData.fixtures = $scope.graphData.fixtures - 1;
		$scope.currentAvgFlux = Math.round($scope.fixtureFlux*$scope.graphData.fixtures);
		$scope.plotGraph();
	};

  $scope.plotGraph = function () {  	

	$scope.graphData.maxSpace = 1.25;
	$scope.graphData.noOfRows = Math.round($scope.graphData.roomWidth/$scope.graphData.maxSpace);
	$scope.graphData.fixturesInRow = Math.round($scope.graphData.fixtures/$scope.graphData.noOfRows);
	$scope.graphData.axialSpace = $scope.graphData.roomLength/$scope.graphData.fixturesInRow;
	$scope.graphData.traverseSpace = $scope.graphData.roomWidth/$scope.graphData.noOfRows;

	$scope.graphData.plotData = [];

	var _rowPosition = $scope.graphData.axialSpace/2;
	for(var y = 0 ; y < $scope.graphData.noOfRows ; y++){
		var _colposition = $scope.graphData.traverseSpace/2;
		for(var z = 0 ; z < $scope.graphData.fixturesInRow ; z++){
			var _data=[];
			_data[0] = _rowPosition;
			_data[1] = _colposition;
			$scope.graphData.plotData.push(_data);
			_colposition = _colposition + $scope.graphData.axialSpace;
		}
		_rowPosition = _rowPosition+ $scope.graphData.traverseSpace;
	}

    $('#container').highcharts({

        chart: {
            type: 'scatter',
            plotBorderWidth: 1,
            zoomType: 'xy',
            backgroundColor: {
		         	linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
		          stops: [
		            [0, '#2a2a2b'],
		            [1, '#3e3e40']
		         	]
		      	},
				    style: {
				      fontFamily: "Roboto Regular"
				    },
        },
        subtitle: {
		      style: {
		         color: '#E0E0E3'
		      }
		   	},
        xAxis: {
        		gridLineColor: '#707073',
        		gridLineWidth: 1,
            title: {
              enabled: true,
              text: 'Width (Meters)'
            }
        },
        yAxis: {
        		gridLineColor: '#707073',
            title: {
          		enabled: true,
              text: 'Length (Meters)'
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                 tooltip: {
                    headerFormat: '<b>Light position</b><br>', 
                    pointFormat: '{point.x} Meters, {point.y} Meters'
                }
            }
        },
        series: [{
            color:'rgba(119, 152, 191, .5)',
            data: $scope.graphData.plotData,
        }]

    });
};


}]);