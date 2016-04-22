angular.module('services',[]).factory('prj', ['$http', function ($http,$q) {
	
	//var json, deferred = $q.defer(); 
	//'total_eligible', 'total_enrolled' , 'uihp_eligible' , 'uihp_enrolled' ,'harmony_eligible', 'harmony_enrolled'
	return {
		food_inspection_json : function(callback){
			// Replace URL with web links or file location. 
							$http.get("../UI_Builder/data/foodinspection.json").success(function(data){
								callback(data);
							});
		},
		map_locations : function(callback){
							$http.get("../checkVizAngular/data/check_community_partners.csv").success(function(data){
								callback(data);
							});
		}		
		

	};
}]);