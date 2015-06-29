angular.module('liteTech.service', [])

.factory('liteTechService', ['$http', function($http){
	return {
		getResidence : function(){
			return $http({
				url : 'fixtures/residence.data.json', 
				method: 'GET'
			});
		},

		getCommercial : function(){
			return $http({
				url : 'fixtures/commercial.data.json', 
				method: 'GET'
			});
		},
		getIndustrial : function(){
			return $http({
				url : 'fixtures/industrial.data.json', 
				method: 'GET'
			});
		}
	}
}]);