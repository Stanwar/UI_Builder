// MainController for the app 

angular.module('leafletApp').controller("logicController", ['$scope','$http', 'leafletData', 'prj',
	function($scope,$http, leafletData,prj){

		/*
			Declaring scope variables and global variables as needed in the project. 
		*/

		var foodInspectionData;
		// Accessing the config file to get data
        $scope.re_config_file = re_config_file[1];
        $scope.Headers = re_config_file[1].Headers[0].Headers;

        // Slider Control. 
        $scope.transparencyMin = [0, 0,50];
        $scope.transparencyMax = [50, 100,150];

        $scope.transparencyCount = 0;
        $scope.disableCheck = true;
        $scope.heatMapModel = {
        	Patient_Encounter : true,
        	Patient_Charges : false,
        	Disease_Encounter : false
        }; 

        $scope.sourceInitialModel = {
        	Sources : "", 

        };

        $scope.newSourceModel = {
        	Header_Name : "", 
        	Header_Value : "",
        	Diseases : {}
        };

        $scope.sourceRadioModel = {
        	Views : ""
        }; 
        
		$scope.newCheckModel = {
			Categories : ""
		};


		$scope.diseaseModel = {
			//ALL : false,
			Asthma: true,
			Diabetes: false,
			SCD: false,
			Prematurity : false,
			NewbornInjury : false,
			Epilepsy : false
		};

		// End of variable declaration. 


		/*
			Get data using Angular Service. This will get information from either CSV/JSON file or Database. 
			Using PHP to connect to database. Any scripting can be used. 
		*/

		$scope.initializeGrid = function(filterArray){
			$scope.gridData = [];
			//foodInspectionData.data.splice(10);

			filterArray.forEach(function(d){
				var gridRow = {};
				gridRow.InspectionId = d[8];
				gridRow.DbaName = d[10];
				gridRow.LicenseNumber = d[11];
				gridRow.FacilityType = d[12];
				gridRow.RiskTier = d[13];
				gridRow.Address = d[14];
				gridRow.City = d[15];
				gridRow.State = d[16];
				gridRow.Zip = d[17];
				gridRow.InspectionType = d[19];
				gridRow.Results = d[20];
				$scope.gridData.push(gridRow);
			});
			console.log($scope.gridData);
		}

		$scope.serviceFunc = function(){
			prj.food_inspection_json(function(data){
				$scope.foodInspectionData = data;
				foodInspectionData = data;
			});
		}

		// Calling all services asynchronously.
		$scope.serviceFunc();

		
		/*
			Defining Map Information. Adding the Url to get map base layer and attributes to be added. 
		*/
		var osmUrl= 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
		//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';
		
        $scope.definedLayers ={
        	defaultChicago : {
        		name : "Default Chicago",
        		url : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        		type : 'xyz',
        		layerOptions : {
        			zoom: -10,
	        		//scrollWheelZoom : false,
	        		zoomControl: true
        		}
        	}
        };

		angular.extend($scope, {
			// Center on Chicago 
			chicago : {
				lat : 41.867490,
				lng : -87.633645,
				zoom : 12
			}, 
			// markers : map_locations,

			layers : {
				baselayers : {
					osm : $scope.definedLayers.defaultChicago
				}
			}
		});

			// Wait for center to be stablished
           leafletData.getMap().then(function(map) {

			var osmUrl= 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
			//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';

			$scope.zipcodes = L.geoJson(enrolled_zip, 
                {   
                        style : {
                        	fillColor : "green",
							weight : 2, 
							opacity : 1, 
							color : 'white',
							//dashArray : '3',
							fillOpacity : 0.3
                        }
                }).addTo($scope.ZipCodeLayer);

			$scope.ZipCodeLayer.addTo(map);


			angular.extend($scope.controls, {
			   minimap: {
					type: 'minimap',
					layer: {
					   name: 'OpenStreetMap',
					   url: osmUrl,
					   type : 'xyz',
					  // data : ZIPCODES
						zoomLevelOffset : -16
					},
					toggleDisplay: true
				}
			});
			var control2 = new L.Control.Fullscreen();
			control2.addTo(map);

		});


        /*
			Custom code for map colors
        */
		function getColor(d, max){

			var h = (1.0 - max/10) * 240;
			return "hsl(" + h + ", 100%, 50%)";
		}

		/*
			Code for each feature on the map. 
		*/
	 	function onEachFeature(feature, layer){
			
		}	

		/*
			Code for style to be applied to each feature on the map. 
		*/
		function style(feature){
			
		}
		
		/*
			Method to update the grid to reflect the latest columns. 
		*/
		$scope.gridUpdate = function(){
			$scope.TableFieldNames = [];
			$scope.TableFieldNames.push('InspectionId');
			$scope.TableFieldNames.push('DbaName');
			$scope.TableFieldNames.push('LicenseNumber');
			$scope.TableFieldNames.push('FacilityType');
			$scope.TableFieldNames.push('RiskTier');
			// $scope.TableFieldNames.push('Address');
			$scope.TableFieldNames.push('City');
			$scope.TableFieldNames.push('State');
			$scope.TableFieldNames.push('Zip');
			$scope.TableFieldNames.push('InspectionType');
			$scope.TableFieldNames.push('Results');
			if($scope.diseaseResults){
				var len = $scope.diseaseResults.length;
				for(var i=0;i<len;i++){
					if( $scope.diseaseResults[i] =='Asthma'){
						$scope.TableFieldNames.push('ASA');
					}else if($scope.diseaseResults[i] =='Diabetes'){
						$scope.TableFieldNames.push('DIA');
					}else if($scope.diseaseResults[i] =='SCD'){
						$scope.TableFieldNames.push('SCD');
					}else if($scope.diseaseResults[i] =='NewbornInjury'){
						$scope.TableFieldNames.push('NBI');
					}else if($scope.diseaseResults[i] =='Prematurity'){
						$scope.TableFieldNames.push('PREM');
					}else if($scope.diseaseResults[i] =='Epilepsy'){
						$scope.TableFieldNames.push('EPIL');
					}
					
				}
			}

			if($scope.checkResults){
				var len = $scope.checkResults.length;
				for(var i=0;i<len;i++){
					if($scope.checkResults[i] == 'IP'){
						$scope.TableFieldNames.push('IPCost');
						$scope.TableFieldNames.push('IPEnc');
					}else if($scope.checkResults[i] == 'OP'){
						$scope.TableFieldNames.push('OP_Cost');
						$scope.TableFieldNames.push('OP_ENC');
					}else if($scope.checkResults[i] == 'NIPS'){
						$scope.TableFieldNames.push('NIPS_COST');
						$scope.TableFieldNames.push('NIPS_ENC');
					}
					
				}
			}
			
		}

		/*
			Method called onclick when any of the filters is clicked/changed. This method will react to whatever 
			you do on your filters. 
		*/

		$scope.change = function(){

			/*
				Always update grid when any action is performed. 
			*/
			$scope.gridUpdate();
			// Initialize grid. 
			
			$scope.dataFilter = foodInspectionData.data;
			// Use service data to filter data based on the filters applied. 
			if($scope.dataFilter){
				$scope.dataFilter = $scope.dataFilter.filter(function(item){
					if($scope.newSourceModel["Result"].toLowerCase() == item[20].toLowerCase()){
						return item;
					}
				});
			}

			// if($scope.dataFilter){
			// 	$scope.dataFilter = $scope.dataFilter.filter(function(item){
			// 		if($scope.newSourceModel["Risk Tier"].toLowerCase() == item[13].toLowerCase()){
			// 			return item;
			// 		}
			// 	});
			// }

			$scope.initializeGrid($scope.dataFilter);
        }

	}
]);