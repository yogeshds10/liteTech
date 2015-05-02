angular.module('liteTech.service', [])

.factory('liteTechService', ['$http', function($http){
	return {
		getResidence : function(){
			return $http({
				url : 'fixtures/residence.data.json', 
				method: 'GET'
			});
		}
	}
}]);