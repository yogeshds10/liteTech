angular.module('liteTech.controller', ['liteTech.service'])
.controller("appController", ['$scope','$http','liteTechService','$ionicPopup','$timeout','$state', function($scope,$http,liteTechService,$ionicPopup,$timeout,$state){

	$scope.residence = {};
	$scope.selections = {};
	$scope.graphData = {};
	$scope.validateMsg = '';
	$scope.validFlag = false;
	$scope.fixtures = 0;
	$scope.currentAvgFlux = 0;
	$scope.optimumFlux = 250;
	$scope.fixtureFlux = 0;

	$scope.clearData = function(){
		$scope.selections.length = '';
		$scope.selections.width = '';
		$scope.selections.height = '';
		$scope.selections.model = '';
		for(x in $scope.residence.data){
			$scope.residence.data[x].selected = false;
		}
	};

	$scope.category = function(cat){
		$scope.clearData();
		$scope.validFlag = false;
		if(cat === "residence"){
			liteTechService.getResidence().then(function (response){
				$scope.residence.data = response.data;
				$scope.selectedCategory = 'Residence';
				for(x in $scope.residence.data){
					$scope.residence.data[x].selected = false;
				}
			}, function (response){
				$scope.validateMsg = 'Failed to fetch residence data !!!';
			});
		}else if(cat === 'commercial'){
			liteTechService.getCommercial().then(function (response){
				$scope.residence.data = response.data;
				$scope.selectedCategory = 'Commercial';
				for(x in $scope.residence.data){
					$scope.residence.data[x].selected = false;
				}
			}, function (response){
				$scope.validateMsg = 'Failed to fetch residence data !!!';
			});
		}else if(cat === 'industrial'){
			liteTechService.getIndustrial().then(function (response){
				$scope.residence.data = response.data;
				$scope.selectedCategory = 'Industrial';
				for(x in $scope.residence.data){
					$scope.residence.data[x].selected = false;
				}
			}, function (response){
				$scope.validateMsg = 'Failed to fetch residence data !!!';
			});
		}
	};

	$scope.showPopup = function (rd){
	  myPopup = $ionicPopup.show({
	    template: '<div class="popup-wrapper"><a class="close-popup" ng-click="popupClose()"></a><p class="popup-title">'+rd.model_no+'<span>('+rd.category+')</span></p><div class="pop-inner-wrapper"><img src="'+rd.img_url+'" alt="'+rd.model_no+'"><div class="row"><div class="col-title">Input Power</div><div class="col-data">'+rd.input_power+' W</div></div><div class="row"><div class="col-title">Input Voltage</div><div class="col-data">'+rd.input_voltage+' V</div></div><div class="row"><div class="col-title">Driver Efficiency</div><div class="col-data">>'+rd.driver_efficiency+'%</div></div><div class="row"><div class="col-title">Color</div><div class="col-data">'+rd.color+'</div></div><div class="row"><div class="col-title">CRI</div><div class="col-data">'+rd.cri+'</div></div><div class="row"><div class="col-title">Light Output</div><div class="col-data">'+rd.light_output+'</div></div></div></div>',
	    scope: $scope,
	    buttons: [
	      {
	        text: '<b>Select</b>',
	        type: 'button-balanced',
	        onTap: function(e) {
	          $scope.selections.model = rd.model_no;
	          $scope.setValidFlag();
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

	$scope.setValidFlag = function(){
		if(!$scope.selections.length || !$scope.selections.width || !$scope.selections.height || !$scope.selections.model){
			$scope.validFlag = false;
		}else{
			$scope.validFlag = true;
		}
	}

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
		$scope.graphData.model = $scope.selections.model;
		$scope.graphData.roomLength = Math.round($scope.selections.length/3.28);
		$scope.graphData.roomWidth = Math.round($scope.selections.width/3.28);
		$scope.graphData.roomHeight = Math.round($scope.selections.height/3.28);
		$scope.graphData.luminen = parseInt($scope.selections.luminenSet[color]);
		$scope.graphData.fixtures = Math.round(($scope.optimumFlux * $scope.graphData.roomLength * $scope.graphData.roomWidth) / (0.63 * 0.69 * $scope.graphData.luminen));				
		$scope.graphData.fixtureFlux = $scope.optimumFlux/$scope.graphData.fixtures;
		$scope.currentAvgFlux = $scope.optimumFlux;
    $scope.plotGraph();
	};

	$scope.increaseFixture = function (){
		$scope.graphData.fixtures = $scope.graphData.fixtures + 1;
		$scope.currentAvgFlux = Math.round($scope.graphData.fixtureFlux*$scope.graphData.fixtures);
		$scope.plotGraph();
	};

	$scope.decreaseFixture = function (){
		$scope.graphData.fixtures = $scope.graphData.fixtures - 1;
		$scope.currentAvgFlux = Math.round($scope.graphData.fixtureFlux*$scope.graphData.fixtures);
		$scope.plotGraph();
	};

	$scope.graphData.isDrag = true;
	$scope.dragFixtures = function(){
		$('.shadow').fadeToggle();
	  $('.tick line').fadeToggle();
	  if($scope.graphData.isDrag){
	  	$('.drag-button div').html("Done");
	  	$('.drag-button div').css("background","#7ed346");
	  	$('.draggable').css("display","block");
	  	$('.nondraggable').css("display","none");
	  	$scope.graphData.isDrag = false;
	  }else{
	  	$('.drag-button div').html("Move Lights");
	  	$('.draggable').css("display","none");
	  	$('.nondraggable').css("display","block");
	  	$('.drag-button div').css("background","rgb(61,61,61)");
	  	$scope.graphData.isDrag = true;
	  }
	}

  $scope.plotGraph = function () {  

  	$scope.rmLength = $scope.graphData.roomLength;
  	$scope.rmWidth = $scope.graphData.roomWidth;
  	var gcd = function(a,b){
  		while (b > 0)
	    {
	        var temp = b;
	        b = a % b;
	        a = temp;
	    }
	    return a;
  	};

  	// console.log('GCD', gcd($scope.rmLength,$scope.rmWidth));
  	// console.log('Ratio', $scope.rmLength/gcd($scope.rmLength,$scope.rmWidth), ':' , $scope.rmWidth/gcd($scope.rmLength,$scope.rmWidth));

  	var graphwidth = window.innerWidth;
  	if($scope.rmLength <= $scope.rmWidth){
  		var calWidth = graphwidth / ($scope.rmWidth/gcd($scope.rmLength,$scope.rmWidth));	
  	}else{
  		var calWidth = graphwidth / ($scope.rmLength/gcd($scope.rmLength,$scope.rmWidth));	
  	}
  	
  	$scope.graphData.isDrag = false;
  	$scope.dragFixtures();

		if($scope.graphData.luminen <= 900){
			$scope.graphData.maxSpace = 1.2;
		}else if($scope.graphData.luminen > 900 && $scope.graphData.luminen <= 1800){
			$scope.graphData.maxSpace = 1.5;
		}else if($scope.graphData.luminen > 1800 && $scope.graphData.luminen <= 2700){
			$scope.graphData.maxSpace = 2;
		}else if($scope.graphData.luminen > 2700 && $scope.graphData.luminen <= 3600){
			$scope.graphData.maxSpace = 2.5;
		}else if($scope.graphData.luminen > 3600 && $scope.graphData.luminen <= 10000){
			$scope.graphData.maxSpace = 3.5;
		}else if($scope.graphData.luminen > 10000 && $scope.graphData.luminen <= 15000){
			$scope.graphData.maxSpace = 4;
		}else{
			$scope.graphData.maxSpace = 5;
		}

		$scope.graphData.noOfRows = Math.round($scope.graphData.roomWidth/$scope.graphData.maxSpace);
		$scope.graphData.fixturesInRow = Math.round($scope.graphData.fixtures/$scope.graphData.noOfRows);
		$scope.graphData.axialSpace = $scope.graphData.roomLength/$scope.graphData.fixturesInRow;
		$scope.graphData.traverseSpace = $scope.graphData.roomWidth/$scope.graphData.noOfRows;
		$scope.graphData.plotData = [];

		// console.log($scope.graphData);

		if($scope.rmLength <= $scope.rmWidth){
			var _rowPosition = 1;
			for(var y = 0 ; y < $scope.graphData.noOfRows ; y++){
				var _colposition = 1;
				for(var z = 0 ; z < $scope.graphData.fixturesInRow ; z++){
					var _data={};
					_data.x = _rowPosition;
					_data.y = _colposition;
					$scope.graphData.plotData.push(_data);
					_colposition = _colposition + $scope.graphData.axialSpace;
				}
				_rowPosition = _rowPosition+ $scope.graphData.traverseSpace;
			}
		}else{
			var _rowPosition = 1;
			for(var y = 0 ; y < $scope.graphData.noOfRows ; y++){
				var _colposition = 1;
				for(var z = 0 ; z < $scope.graphData.fixturesInRow ; z++){
					var _data={};
					_data.y = _rowPosition;
					_data.x = _colposition;
					$scope.graphData.plotData.push(_data);
					_colposition = _colposition + $scope.graphData.axialSpace;
				}
				_rowPosition = _rowPosition+ $scope.graphData.traverseSpace;
			}
		}

		// $scope.graphData.column = Math.round($scope.graphData.fixtures / $scope.graphData.fixturesInRow);

		setTimeout(function(){
			d3.select('#container svg').remove();
			d3.select('#fullscreen svg').remove();

			if($scope.rmLength <= $scope.rmWidth){
				var height = calWidth * $scope.rmLength/gcd($scope.rmLength,$scope.rmWidth),
	      width = window.innerWidth,
	      radius = 10,
	      radiusdrag = 15,
	      outerRadius = (width / $scope.graphData.fixturesInRow) /1.5,
	      padding = ((window.innerHeight * 80)/100 / $scope.graphData.fixturesInRow/2.5);
	    }else{
				var height = calWidth * $scope.rmWidth/gcd($scope.rmLength,$scope.rmWidth),
	      width = window.innerWidth,
	      radius = 10,
	      radiusdrag = 15,
	      outerRadius = (width / $scope.graphData.noOfRows) /1.5,
	      padding = ((window.innerHeight * 80)/100 / $scope.graphData.noOfRows/2.5);    	
	    }
				
			// console.log('Width', width);
			// console.log('height', height);
			// console.log('ratio cal', calWidth);

		  var margins = {
		    "left": 10,
		    "right": 10,
		    "top": 10,
		    "bottom": 10
		  };

		  var drag = d3.behavior.drag()
		  .origin(function(d) { return d; })
		  .on("dragstart", function(){
		  	d3.event.sourceEvent.stopPropagation();
    		d3.event.sourceEvent.preventDefault();
		  })
		  .on("drag", dragmove);		  

		  var svg = d3.select("#container")
		            .append("svg")
		            .attr("width", width)
		            .attr("height", height)
		            .append("g")
		            .attr("transform", "translate(" + 0 + "," + 0 + ")");

		  var x = d3.scale.linear()
		          .domain(d3.extent($scope.graphData.plotData, function (d) {
		            return d.x;
		          }))
		          .range([padding , width - padding]);

		  var y = d3.scale.linear()
		      .domain(d3.extent($scope.graphData.plotData, function (d) {
		          return d.y;
		      }))
		      .range([height - padding, padding]);

		 //  var xAxis = d3.svg.axis()
			//     .scale(x)
			//     .orient("bottom")
			//     .innerTickSize(-height)
			//     .outerTickSize(0)
			//     .tickPadding(0);

			// var yAxis = d3.svg.axis()
			//     .scale(y)
			//     .orient("left")
			//     .innerTickSize(-width)
			//     .outerTickSize(0)
			//     .tickPadding(0);

			// var line = d3.svg.line()
			//     .x(function(d) { return x(d.x); })
			//     .y(function(d) { return y(d.y); });

			// svg.append("g")
			//       .attr("class", "x axis")
			//       .attr("transform", "translate(0," + height + ")")
			//       .call(xAxis);

		 //  svg.append("g")
		 //      .attr("class", "y axis")
		 //      .call(yAxis);

		   // Define the gradient
		    var gradient = svg.append("svg:defs")
		        .append("svg:radialGradient")
		        .attr("id", "gradient")
		        .attr("fx", "50%")
		        .attr("fy", "50%")
		        .attr("r", "50%")
		        .attr("spreadMethod", "pad");

		    // Define the gradient colors
		    gradient.append("svg:stop")
		        .attr("offset", "0%")
		        .attr("stop-color", "#fafafa")
		        .attr("stop-opacity", 1);

		    gradient.append("svg:stop")
		        .attr("offset", "100%")
		        .attr("stop-color", "#fff")
		        .attr("stop-opacity", 0);


		    var groups = svg.selectAll("g.node")
		        .data($scope.graphData.plotData)
		        .enter().append("g")
		        .classed("node", true)
		        .attr("z-index", "-1")
		        .attr('transform', function (d) {
		          return "translate(" + x(d.x) + "," + y(d.y) + ")";
		        });

		    groups.append("circle")
		    .attr("r", outerRadius)
		    .attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; })
		    .attr('fill', 'url(#gradient)')
		    .classed('shadow', true);

		    groups.append("circle")
		    .attr("r", radiusdrag)
		    .attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; })
		    .style("fill", '#7fd347')
		    .classed('draggable', true)
		    .call(drag);

		    groups.append("circle")
		    .attr("r", radius)
		    .attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; })
		    .style("fill", '#7fd347')
		    .classed('nondraggable', true);

		    function dragmove(d) {
		      d3.select(this)
		      .attr("cx", d.x = d3.event.x)
		      .attr("cy", d.y = d3.event.y);

			    var shadowNode = this.parentNode.querySelector('.shadow');
			    d3.select(shadowNode)
		      .attr("cx", d.x = d3.event.x)
		      .attr("cy", d.y = d3.event.y);

		      var nonDraggbleNode = this.parentNode.querySelector('.nondraggable');
			    d3.select(nonDraggbleNode)
		      .attr("cx", d.x = d3.event.x)
		      .attr("cy", d.y = d3.event.y);

			    var groundNode = this.parentNode.querySelector('.node');
			    d3.select(groundNode)
		      .attr("transform", function () {
		          return "translate(" + d3.event.x + "," + d3.event.y + ")";
		      });
		  	}

		  	var fwidth = window.innerWidth;
		  	var fheight = window.innerHeight;

		  	$scope.graphData.fplotData = [];
		  	if($scope.rmLength <= $scope.rmWidth){
					var _rowPosition = 1;
					for(var y = 0 ; y < $scope.graphData.noOfRows ; y++){
						var _colposition = 1;
						for(var z = 0 ; z < $scope.graphData.fixturesInRow ; z++){
							var _data={};
							_data.y = _rowPosition;
							_data.x = _colposition;
							$scope.graphData.fplotData.push(_data);
							_colposition = _colposition + $scope.graphData.axialSpace;
						}
						_rowPosition = _rowPosition+ $scope.graphData.traverseSpace;
					}
				}else{
					var _rowPosition = 1;
					for(var y = 0 ; y < $scope.graphData.noOfRows ; y++){
						var _colposition = 1;
						for(var z = 0 ; z < $scope.graphData.fixturesInRow ; z++){
							var _data={};
							_data.x = _rowPosition;
							_data.y = _colposition;
							$scope.graphData.fplotData.push(_data);
							_colposition = _colposition + $scope.graphData.axialSpace;
						}
						_rowPosition = _rowPosition+ $scope.graphData.traverseSpace;
					}
				}

		  	var fsvg = d3.select("#fullscreen")
		            .append("svg")
		            .attr("width", fwidth)
		            .attr("height", fheight)
		            .append("g")
		            .attr("transform", "translate(" + 0 + "," + 0 + ")");		  

		    var fx = d3.scale.linear()
		          .domain(d3.extent($scope.graphData.fplotData, function (d) {
		            return d.x;
		          }))
		          .range([padding , fwidth - padding]);

		  	var fy = d3.scale.linear()
		      .domain(d3.extent($scope.graphData.fplotData, function (d) {
		          return d.y;
		      }))
		      .range([fheight - padding, padding]);          

		    // Define the gradient
		    var gradient = fsvg.append("svg:defs")
		        .append("fsvg:radialGradient")
		        .attr("id", "gradient")
		        .attr("fx", "50%")
		        .attr("fy", "50%")
		        .attr("r", "50%")
		        .attr("spreadMethod", "pad");

		    // Define the gradient colors
		    gradient.append("fsvg:stop")
		        .attr("offset", "0%")
		        .attr("stop-color", "#fafafa")
		        .attr("stop-opacity", 1);

		    gradient.append("fsvg:stop")
		        .attr("offset", "100%")
		        .attr("stop-color", "#fff")
		        .attr("stop-opacity", 0);

		    var groups = fsvg.selectAll("g.node")
		        .data($scope.graphData.fplotData)
		        .enter().append("g")
		        .classed("node", true)
		        .attr("z-index", "-1")
		        .attr('transform', function (d) {
		          return "translate(" + fx(d.x) + "," + fy(d.y) + ")";
		        });

		    groups.append("circle")
		    .attr("r", outerRadius)
		    .attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; })
		    .attr('fill', 'url(#gradient)')
		    .classed('shadow', true);

		    groups.append("circle")
		    .attr("r", radiusdrag)
		    .attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; })
		    .style("fill", '#7fd347')
		    .classed('draggable', true)
		    .call(drag);

		    groups.append("circle")
		    .attr("r", radius)
		    .attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; })
		    .style("fill", '#7fd347')
		    .classed('nondraggable', true);

		},500);

  };

  $scope.fullscreen = function(){
  	$scope.plotGraph();
  	$state.go('fullscreen');
  };
  $scope.backToResults = function(){
  	$scope.plotGraph();
  	$state.go('result');
  }

}]);