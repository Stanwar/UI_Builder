angular.module('services',[]).factory('uihp', ['$http', function ($http,$q) {

	/*
		Creating services for each type of data we need. There are two for each mode. 
		We are also loading some map locations here.
	*/
	return {
		// total_eligible : 	function (callback){
		// 			//var json; 
		// 			 $http.get("../checkVizAngular/data/total_eligible.php").success(function(data){
		// 				callback(data);
		// 			});
		// 			//console.log(json);
					 
		// 		},
		// total_enrolled : function (callback){
		// 					 $http.get("../checkVizAngular/data/total_enrolled.php").success(function(data){
		// 						callback(data);
		// 					});
		// 				},
		// uihp_eligible : function (callback){
		// 					 $http.get("../checkVizAngular/data/uihp_eligible.php").success(function(data){
		// 						callback(data);
		// 					});
		// },
		// uihp_enrolled : function (callback){
		// 					 $http.get("../checkVizAngular/data/uihp_enrolled.php").success(function(data){
		// 						callback(data);
		// 					});
		// },
		new_regular_enrolled : function (callback){
							 $http.get("../test_CPAR/data/newRegular_enrolled.php").success(function(data){
								callback(data);
							});
		},
		new_regular_engaged : function (callback){
							 $http.get("../test_CPAR/data/newRegular_engaged.php").success(function(data){
								callback(data);
							});
		},
		default_mode_enrolled : function (callback){
							$http.get("../test_CPAR/data/defaultModeEnrolledPatients.php").success(function(data){
								callback(data);
							});
		},
		default_mode_engaged : function (callback){
							$http.get("../test_CPAR/data/defaultModeEngaged.php").success(function(data){
								callback(data);
							});
		},
		// harmony_eligible : function (callback){
		// 					 $http.get("../checkVizAngular/data/harmony_eligible.php").success(function(data){
		// 						callback(data);
		// 					});
		// },
		// patientsPerZip : function(callback){
		// 					$http.get("../checkVizAngular/data/unique_patients.php").success(function(data){
		// 						callback(data);
		// 					});
		// },
		// harmony_enrolled : function (callback){
		// 					 $http.get("../checkVizAngular/data/harmony_enrolled.php").success(function(data){
		// 						callback(data);
		// 					});
		// },
		map_locations : function(callback){
							$http.get("../checkVizAngular/data/check_community_partners.csv").success(function(data){
								callback(data);
							});
		}		
		

	};
}]);
