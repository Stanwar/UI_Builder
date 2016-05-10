// MainController for the app 

angular.module('leafletApp').controller("mapController", ['$scope','$http', 'leafletData', 'uihp',
	function($scope,$http, leafletData,uihp){
		  
		var source; 
		var tracker = 0;
        var age;
        var encounter;
        var checkResults = [];
        var diseaseResults = [];
        var ageResults = [];
        var uihp_data ; 
        var disease_filter;
        var dataModel_filter = [];
        var zipCodeMap;
        $scope.zipCodeMap;
        $scope.EncounterBinsResults = [];
        $scope.DiseaseEncounterBinsResults = [];
        $scope.Marker_Locations = map_locations;
       
       	// $scope.vizDetails = vizDetails;
        $scope.TableFieldNames = ['Zip'];
        // Adding custom 
        $scope.uihp_update = []; 
        $scope.ZipCodeLayer = new L.LayerGroup();
        $scope.checkGeojson = {};
        $scope.legendTotal = [];
        $scope.legendMax = [];
        $scope.pChargeLegendMax = [];
        $scope.pEncounterLegendMax = [];
        $scope.dLegendMax = [];
        $scope.getArray = [];
        $scope.filename ="check_cri";
        $scope.config_file = config_file;
        $scope.binDivide = 7;
        $scope.EncounterTimeBins = [
        	{"name" : "last month", "index" : 0},
        	{"name" : "last 3 month", "index" : 1},
        	{"name" : "last 6 month", "index" : 2},
        	{"name" : "last 1 year", "index" : 3},
        	{"name" : "last 2 year", "index" : 4}
        ]; 
        
        $scope.filterbin = 7;
        // New Config File Read
        $scope.config_header = config_file[0].Headers;

        // Source information coming from configuration file 
        $scope.Sources = config_file[1].Sources;
        //$scope.Source_Label = config_file[].Source_Label;

        // View information coming from configuration file
        $scope.Views = config_file[2].Views;
        $scope.View_Label = config_file[2].View_Label;

        // Age information coming from configuration file
        $scope.Ages = config_file[3].Ages;
        $scope.Ages_Label = config_file[3].Age_Label;

        $scope.Gender = config_file[7].Gender;
        $scope.Gender_Label = config_file[7].Gender_label;

        // Show and hide Bins 
        $scope.mapControlCharge = false;
        $scope.mapControlDisease = false;
        $scope.mapControlEncounter = false;


//        $scope.EncounterBins = ;
        // Transparency Color Slider
        $scope.transparencyMin = 0;
        $scope.transparencyMax = 10;

        $scope.ageMin = 0;
        $scope.ageMax = 30;

        $scope.disableCheck = true;
        $scope.heatMapModel = {
        	Patient_Encounter : true,
        	Patient_Charges : false,
        	Disease_Encounter : false
        }; 
        $scope.sourceInitialModel = {
        	Sources : ""
        };

        $scope.sourceRadioModel = {
        	Views : ""
        }; 

        $scope.ageRadioModel = {
        	Ages : ""
        }; 
        $scope.genderModel = {
        	Gender : ""
        }; 
        $scope.genderModel.Gender = "All";
		$scope.checkModel = {
			//ALL : true,
			IP: true,
			OP: false,
			NIPS: false
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
		$scope.getScreenshot = function(){
			//GrabzIt("ZWVmYzY4ZmVjZGE5NGRkZGFhODYwNDQ5ZTA5NzkzYzA=").AddTo('insertCode', 'http://stanwa2.people.uic.edu/', {"delay": 1000, "format": "png"});
			"api.grabz.it/services/javascript.ashx?key=ZWVmYzY4ZmVjZGE5NGRkZGFhODYwNDQ5ZTA5NzkzYzA=&url=http://www.google.com"

		}

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
			markers : map_locations,

			layers : {
				baselayers : {
					osm : $scope.definedLayers.defaultChicago
				},
				overlays: {
                    chicagoLocations: {
                        name: "Chicago Locations",
                        type: "markercluster",
                        visible: true
                    }
                }
			}
		});

			// Wait for center to be stablished
           leafletData.getMap().then(function(map) {

				var osmUrl= 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
				//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
				var osmAttrib='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';
				//var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
				//var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	
				$scope.zipcodes = L.geoJson(ZIPCODES, 
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
				//var control3 = new L.easyPrint();
				//control3.addTo(map);
				control2.addTo(map);

       });
		
		function getColor(d, max){

			var h = (1.0 - max/10) * 240;



  			return "hsl(" + h + ", 100%, 50%)";
		}

	 	function onEachFeature(feature, layer){
			var t = feature.properties.ZIP;

			var zipContent = {};
			if(zipCodeMap !=null ){
				
				if(zipCodeMap.has(t)){
					var content = "<table class='table table-hover'>"+ 
			                                    "<thead>" + 
			                                        "<tr>" + 
			                                            "<th> ZipCode :</th>"+
			                                            "<td>" + t + "</td>"+
			                                        "</tr>" + 
			                                    "</thead>" + 
			                                    "<tbody>" +  "<tr>" + 
			                                            "<th>Charges:</th>"+
			                                            "<td>" + numeral(zipCodeMap.get(t).get("Patient_Charges")).format('$0,0.00')  + "</td>"+
			                                        "</tr>" +
			                                        "<tr>" + 
			                                        "<th>Encounters:</th>"+
			                                            "<td>"+ numeral(zipCodeMap.get(t).get("Patient_Encounters")).format('0.0a') +"</td>" + 
			                                        "</tr>"+
			                                        "<tr>" + 
			                                        "<th>Unique Patients:</th>"+
			                                            "<td>"+ numeral(zipCodeMap.get(t).get("Unique_Patients").size).format('0.0a') +"</td>" + 
			                                        "</tr>"+
			                                    "</tbody>" + 
			                                "</table>";
			            zipContent.Zip = t;                    
			            zipContent.PatientCharges = zipCodeMap.get(t).get("Patient_Charges");
			            zipContent.PatientEncounters = zipCodeMap.get(t).get("Patient_Encounters");
			            zipContent.UniquePatients = zipCodeMap.get(t).get("Unique_Patients").size;
						
						$scope.uihp_update.push(zipContent);

			            layer.bindPopup(content);
				}
			}
		}	

		function style(feature){

			var t = feature.properties.ZIP;

			var style_calc = 0;
			if(zipCodeMap !=null ){
				
				if(zipCodeMap.has(t)){


					if($scope.heatMapModel == "Patient_Encounter"){
						style_calc = zipCodeMap.get(t).get("Patient_Encounters");
					}else if($scope.heatMapModel =="Patient_Charges"){
						style_calc = zipCodeMap.get(t).get("Patient_Charges");
					}
				}
			}

        	var len= $scope.EncounterChargeBins.length;
     		for(var i=0; i<len;i++){
             	if($scope.EncounterChargeBins[i].checked && $scope.heatMapModel =="Patient_Charges"){
            		if(style_calc >= $scope.EncounterChargeBins[i].min && style_calc <= $scope.EncounterChargeBins[i].max){
	                				///////
						return {
								fillColor : getColor(style_calc,$scope.EncounterChargeBins[i].type),
								weight : 2, 
								opacity : 1, 
								color : 'black',
								dashArray : '3',
								fillOpacity : parseInt($scope.transparencyMax)/10
							};
            		}
            		
            	}
            }

        	var len= $scope.EncounterBins.length;
     		for(var i=0; i<len;i++){
             	if($scope.EncounterBins[i].checked && $scope.heatMapModel =="Patient_Encounter"){
            		if(style_calc >= $scope.EncounterBins[i].min && style_calc <= $scope.EncounterBins[i].max){
	                				///////
						return {
								fillColor : getColor(style_calc,$scope.EncounterBins[i].type),
								weight : 2, 
								opacity : 1, 
								color : 'black',
								dashArray : '3',
								fillOpacity : parseInt($scope.transparencyMax)/10
							};
            		}
            		
            	}
            }
            
			return {
					fillColor : 'white',
					weight : 2, 
					opacity : 1, 
					color : 'black',
					dashArray : '3',
					fillOpacity : parseInt($scope.transparencyMax)/10
				};

		}
		/// Add object to an array for file pickup
		$scope.gridUpdate = function(){
			$scope.TableFieldNames = [];
			$scope.TableFieldNames.push('Zip');
			$scope.TableFieldNames.push('UniquePatients');
			$scope.TableFieldNames.push('PatientCharges');
			$scope.TableFieldNames.push('PatientEncounters');
			// if($scope.heatMapModel == "Disease_Encounter"){
			// 	$scope.TableFieldNames.push('DIS_ENC');
			// }
			// if($scope.heatMapModel == "Patient_Charges"){
			// 	$scope.TableFieldNames.push('TotalCOST');
			// }
			// if($scope.heatMapModel == "Patient_Encounter"){
			// 	$scope.TableFieldNames.push('TotalENC');
			// }
			
			// if($scope.diseaseResults){
			// 	var len = $scope.diseaseResults.length;
			// 	for(var i=0;i<len;i++){
			// 		if( $scope.diseaseResults[i] =='Asthma'){
			// 			$scope.TableFieldNames.push('ASA');
			// 		}else if($scope.diseaseResults[i] =='Diabetes'){
			// 			$scope.TableFieldNames.push('DIA');
			// 		}else if($scope.diseaseResults[i] =='SCD'){
			// 			$scope.TableFieldNames.push('SCD');
			// 		}else if($scope.diseaseResults[i] =='NewbornInjury'){
			// 			$scope.TableFieldNames.push('NBI');
			// 		}else if($scope.diseaseResults[i] =='Prematurity'){
			// 			$scope.TableFieldNames.push('PREM');
			// 		}else if($scope.diseaseResults[i] =='Epilepsy'){
			// 			$scope.TableFieldNames.push('EPIL');
			// 		}
					
			// 	}
			// }

			// if($scope.checkResults){
			// 	var len = $scope.checkResults.length;
			// 	for(var i=0;i<len;i++){
			// 		if($scope.checkResults[i] == 'IP'){
			// 			$scope.TableFieldNames.push('IPCost');
			// 			$scope.TableFieldNames.push('IPEnc');
			// 		}else if($scope.checkResults[i] == 'OP'){
			// 			$scope.TableFieldNames.push('OP_Cost');
			// 			$scope.TableFieldNames.push('OP_ENC');
			// 		}else if($scope.checkResults[i] == 'NIPS'){
			// 			$scope.TableFieldNames.push('NIPS_COST');
			// 			$scope.TableFieldNames.push('NIPS_ENC');
			// 		}
					
			// 	}
			// }
			
		}
		$scope.change = function(){

			// Updating tabular grid. 
			$scope.gridUpdate();

			// Choose source and view and get data based on it. 
			if($scope.sourceInitialModel.Sources == "Total"
				|| $scope.sourceInitialModel.Sources == "UIHP"
				|| $scope.sourceInitialModel.Sources == "Harmony"
				&& ( $scope.sourceRadioModel.Views == "Eligible"
					|| $scope.sourceRadioModel.Views == "Enrolled")){
				$scope.disableCheck = false;
			}

			$scope.uihp_update = []; 
			console.log(source);
			if($scope.sourceInitialModel.Sources == "Total" && $scope.sourceRadioModel.Views == "Eligible"){
				uihp.total_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				    $scope.uihp_data = data;
				});
			}
			// else if($scope.sourceInitialModel.Sources == "Total" && $scope.sourceRadioModel.Views == "Enrolled"){
			// 	uihp.total_enrolled(function(data){
			// 	    $scope.uihp = data;
			// 	    uihp_data = data;
			// 	    $scope.uihp_data = data;
			// 	});
			// }
			else if ($scope.sourceInitialModel.Sources == "UIHP" && $scope.sourceRadioModel.Views == "Eligible"){
				uihp.uihp_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				    $scope.uihp_data = data;
				});
			}
			else if ( ($scope.sourceInitialModel.Sources == "UIHP" || $scope.sourceInitialModel.Sources == "Total" || $scope.sourceInitialModel.Sources == "Harmony" )&& $scope.sourceRadioModel.Views == "Enrolled"){
				// uihp.uihp_enrolled(function(data){
				//     $scope.uihp = data;
				//     uihp_data = data;
				//     $scope.uihp_data = data;

				// });
				uihp.new_uihp_enrolled(function(data){
					$scope.dataModel_filter = data;
				});
			}
			else if ($scope.sourceInitialModel.Sources == "Harmony" && $scope.sourceRadioModel.Views == "Eligible"){
				uihp.harmony_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				    $scope.uihp_data = data;
				});
			}
			// else if ($scope.sourceInitialModel.Sources == "Harmony" && $scope.sourceRadioModel.Views == "Enrolled"){
			// 	uihp.harmony_enrolled(function(data){
			// 	    $scope.uihp = data;

			// 	    uihp_data = data;
			// 	    $scope.uihp_data = data;
			// 	});
			// }
            var total_charges = 0 ;

            if($scope.dataModel_filter){
	            	//$scope.dataModel_filter = $scope.uihp_data;
	            dataModel_filter = $scope.dataModel_filter;
	            //////
	            /// Filtering for DataSource
	            //////
	            if($scope.sourceInitialModel.Sources != "Total"){
	            	dataModel_filter = dataModel_filter.filter(function(x){
		        		if($scope.sourceInitialModel.Sources == "Harmony"
		        			&& x.DataSource ==  $scope.sourceInitialModel.Sources
		        			){
		        			return x;
		        		}else if( $scope.sourceInitialModel.Sources == "UIHP"
		        			&& x.DataSource ==  $scope.sourceInitialModel.Sources ){
		        			return x;
		        		}
		        	});
	            }
	            
	            //////
	            // Creating Gender Filter 
	            //////
	            if($scope.genderModel.Gender != "All"){
		        	dataModel_filter = dataModel_filter.filter(function(x){
		        		if($scope.genderModel.Gender == "Male"
		        			&& x.Gender == "1" 
		        			){
		        			return x;
		        		}else if( $scope.genderModel.Gender == "Female"
		        			&& x.Gender == "2" ){
		        			return x;
		        		}
		        	});
		    	}

		    	////////
	        	// Creating Age Filter
	        	///////
	        	dataModel_filter = dataModel_filter.filter(function(x){
	        		if($scope.ageMin < x.Age && $scope.ageMax > x.Age
	        			){
	        			return x;
	        		}
	        	});

	        	///////
	        	// Creating new map to filter out based on service categories
	        	//////
	        	var serviceCategoryMap = new Map();
	        	$scope.checkResults.forEach(function (key){
	        		serviceCategoryMap.set(key, true);        		
	        	});

	        	///////
	        	// Filtering by service category
	        	//////
	        	dataModel_filter = dataModel_filter.filter(function(x){
	        		if(serviceCategoryMap.get(x.RecordIDCd)){
	        			return x;
	        		}
	        	});

	        	///////
	        	// Filtering by diseases
	        	//////
	        	var diseaseMap = new Map();
	        	$scope.diseaseResults.forEach(function (key){
	        		diseaseMap.set(key, true);        		
	        	});

	        	//////
	        	//	Filtering if disease is selected. 
	        	//////
	        	if(diseaseMap.size > 0){
	        		dataModel_filter = dataModel_filter.filter(function(x){
		        		if((diseaseMap.has("Asthma") && x.Asthma > 0) 
		        			|| (diseaseMap.has("Diabetes") && x.Diabetes > 0)
		        			|| (diseaseMap.has("SCD") && x.SCD > 0)
		        			|| (diseaseMap.has("Prematurity") && x.Prematurity > 0)
		        			|| (diseaseMap.has("Epilepsy") && x.Epilepsy > 0)
		        			|| (diseaseMap.has("NewbornInjury") && x.Newborn > 0)){
		        			return x;
		        		}
	        		});
	        	}
				

	        	zipCodeMap = new Map();

	        	///////
	        	// Creating a Map for each ZipCode with number of unique RecipientIds, Total Patient_Encounters, Total Patient_Charges. 
	        	//////
	        	dataModel_filter.forEach(function(x){
	        		
	        		if(!zipCodeMap.has(x.Zip)){

	        			var secondMap = new Map();
	        			var recipientSet= new Set();

	        			secondMap.set("Unique_Patients", recipientSet.add(x.RecipientID));
	        			secondMap.set("Patient_Encounters", parseInt(x.Patient_Encounters));
	        			secondMap.set("Patient_Charges", parseInt(x.Patient_Charges));
	        			zipCodeMap.set(x.Zip, secondMap);
	        		}else{
	        			//var map = zipCodeMap.get(x.Zip);
	        			zipCodeMap.get(x.Zip).set("Unique_Patients", zipCodeMap.get(x.Zip).get("Unique_Patients").add(x.RecipientID));
	        			zipCodeMap.get(x.Zip).set("Patient_Encounters", parseInt(zipCodeMap.get(x.Zip).get("Patient_Encounters")) + parseInt(x.Patient_Encounters));
	        			zipCodeMap.get(x.Zip).set("Patient_Charges", parseInt(zipCodeMap.get(x.Zip).get("Patient_Charges")) + parseInt(x.Patient_Charges));
	        		}
	        	});

	        	var maxEncounters = 0;
	        	var maxCharges = 0;
	        	zipCodeMap.forEach(function(x){

	        		if(maxEncounters <= x.get("Patient_Encounters")){
	        			maxEncounters = x.get("Patient_Encounters");
	        		}

	        		if(maxCharges <= x.get("Patient_Charges")){
	        			maxCharges = x.get("Patient_Charges");
	        		}
	        	});

	        	$scope.maxEncounters = maxEncounters;
	        	$scope.maxCharges = maxCharges;

	        	if($scope.heatMapModel == "Patient_Charges"){
					$scope.mapControlEncounter = false;
					$scope.mapControlDisease = false;
					$scope.mapControlCharge = true;
				}else if($scope.heatMapModel == "Patient_Encounter"){
					$scope.mapControlCharge = false;
					$scope.mapControlDisease = false;
					$scope.mapControlEncounter = true;
				}
            }
           
            $scope.$watchCollection('sourceInitialModel',function(){
				source = $scope.sourceRadioModel;
			//            console.log($scope.sourceRadioModel);          
			})

            $scope.$watchCollection('ageRadioModel', function() {
            	$scope.ageResults = [];
	            angular.forEach($scope.ageRadioModel, function (value, key) {
	                if (value) {
	                    //console.log(key);
	                    ageResults.push(key);
	                    $scope.ageResults.push(key);
	                }
	            });
	            //age = $scope.ageRadioModel;
	        });

	        $scope.$watchCollection('diseaseModel', function () {
	            $scope.diseaseResults = [];
	            angular.forEach($scope.diseaseModel, function (value, key) {
	                if (value) {
	                    //console.log(key);
	                    diseaseResults.push(key);
	                    $scope.diseaseResults.push(key);
	                }
	            });
	        });

	        $scope.$watchCollection('checkModel', function () {
	            $scope.checkResults = [];
	            angular.forEach($scope.checkModel, function (value, key) {
	                if (value) {
	                    //console.log(key);
	                    checkResults.push(key);
	                    $scope.checkResults.push(key);
	                }
	            });
	        });

	        if($scope.sourceInitialModel.Sources && 
	        	($scope.sourceRadioModel.Views == "Enrolled" || $scope.sourceRadioModel.Views == "Eligible" ) ){

	        	var max = $scope.maxEncounters;

	        	var BD = parseInt($scope.binDivide);

	        	var BS = parseInt(max/$scope.binDivide);
	        	

				$scope.EncounterBins = [];

				console.log(BD);
				var fc = 0;

	        	while(BD > 0){

					if(fc == 0){
						$scope.EncounterBins.push(
		        		{
		        			"Bin" : parseInt(1) + " - " + parseInt(max-(BS*(BD-1)) -1),
		        			"type" : BD,
		        			"min" : parseInt(1),
		        			"max" : parseInt(max-(BS*(BD-1)) -1),
		        			checked : true
		        		});
					}
					else if(BD === 1) {
						$scope.EncounterBins.push(
		        		{
		        			"Bin" : parseInt(max-(BS*BD)) + " - " + parseInt(max-(BS*(BD-1))),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) ),
		        			checked : true
		        		});
					}
					else {
						$scope.EncounterBins.push(
		        		{
		        			"Bin" : parseInt(max-(BS*BD)) + " - " + parseInt(max-(BS*(BD-1)) - 1),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) - 1),
		        			checked : true
		        		});
					}
					fc = 1;
	        		BD = BD - 1;
	        		//console.log("BD :" + BD);
	        	}
	        	var max = $scope.maxCharges;

	        	//binSize = parseInt(max/7);
	        	
				var BD = parseInt($scope.binDivide);

	        	var BS = parseInt(max/$scope.binDivide);
	        	

				$scope.EncounterChargeBins = [];

				//console.log(BD);
				var fc = 0;

	        	while(BD > 0){

					if(fc == 0){
						$scope.EncounterChargeBins.push(
		        		{
		        			"Bin" : numeral(parseInt(1)).format('($ 0.00 a)') + " - " + numeral(parseInt(max-(BS*(BD-1)) -1)).format('($ 0.00 a)'),
		        			"type" : BD,
		        			"min" : parseInt(1),
		        			"max" : parseInt(max-(BS*(BD-1)) -1),
		        			checked : true
		        		});
					}
					else if(BD === 1) {
						$scope.EncounterChargeBins.push(
		        		{
		        			"Bin" : numeral(parseInt(max-(BS*BD))).format('($ 0.00 a)') + " - " + numeral(parseInt(max-(BS*(BD-1)))).format('($ 0.00 a)'),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) ),
		        			checked : true
		        		});
					}
					else {
						$scope.EncounterChargeBins.push(
		        		{
		        			"Bin" : numeral(parseInt(max-(BS*BD))).format('($ 0.00 a)') + " - " + numeral(parseInt(max-(BS*(BD-1)) - 1)).format('($ 0.00 a)'),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) - 1),
		        			checked : true
		        		});
					}
					fc = 1;
	        		BD = BD - 1;
	        		//console.log("BD :" + BD);
	        	}
				
	        	var max = $scope.dLegendMax[0];

	        	//binSize = parseInt(max/7);
	        	
				var BD = parseInt($scope.binDivide);

	        	var BS = parseInt(max/$scope.binDivide);
	        	

				$scope.DiseaseEncounterBins = [];

				console.log(BD);
				var fc = 0;

	        	while(BD > 0){

					if(fc == 0){
						$scope.DiseaseEncounterBins.push(
		        		{
		        			"Bin" : parseInt(1) + " - " + parseInt(max-(BS*(BD-1)) -1),
		        			"type" : BD,
		        			"min" : parseInt(1),
		        			"max" : parseInt(max-(BS*(BD-1)) -1),
		        			checked : true
		        		});
					}
					else if(BD === 1) {
						$scope.DiseaseEncounterBins.push(
		        		{
		        			"Bin" : parseInt(max-(BS*BD)) + " - " + parseInt(max-(BS*(BD-1))),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) ),
		        			checked : true
		        		});
					}
					else {
						$scope.DiseaseEncounterBins.push(
		        		{
		        			"Bin" : parseInt(max-(BS*BD)) + " - " + parseInt(max-(BS*(BD-1)) - 1),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) - 1),
		        			checked : true
		        		});
					}
					fc = 1;
	        		BD = BD - 1;
	        		//console.log("BD :" + BD);
	        	}
	            leafletData.getMap().then(function(map) {

	           		map.removeLayer($scope.ZipCodeLayer);
	           		console.log(
	           			"After deleting zipcodelayer");

					$scope.ZipCodeLayer = new L.LayerGroup();

					$scope.checkGeojson = L.geoJson(ZIPCODES, 
	                    { 
                    		onEachFeature : onEachFeature,
                            style : style
	                    }).addTo($scope.ZipCodeLayer);
					map.addLayer($scope.ZipCodeLayer);
					// Removing Legend 
	           
	            $("div").remove(".legend.leaflet-control");
	           
	            
				var div = L.DomUtil.create('div', 'info legend');
				
				var legend = L.control();
				// declaring legend again 
				var legendData  = {
					colors : [],
					labels : []
				}; 

				// Color Array
				//legendData.colors = ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976'];

				if($scope.heatMapModel == "Patient_Charges"){
					var max = $scope.maxCharges;
				}else if($scope.heatMapModel == "Patient_Encounter"){
					var max = $scope.maxEncounters;
				}

				var bin = parseInt(max/$scope.binDivide);
				var loop = $scope.binDivide;


				
				for(var i = 1; i <= loop; i++){
					
					if(i==loop){
						legendData.labels.push("> " + 1);
					}else{
						legendData.labels.push("> " + parseInt(max-bin*parseInt(i)));
					}
					
				}

				for(var i=1; i<=loop;i++){
					var h = (1.0 - i/10) * 240;
					legendData.colors.push("hsl(" + h + ", 100%, 50%)");
				}
				for (var i = 0; i < legendData.colors.length; i++) {
					div.innerHTML +=
					'<div class="outline"><i style="background:' + legendData.colors[i] + '"></i></div>' +
					'<div class="info-label">' + legendData.labels[i] + '</div>';
					
				}
				// div.innerHTML += '<div class="print"><input type="button" onclick="window.print();" value="print"></div>';
				legend.onAdd = function(map){
					return div;
				}

				legend.addTo(map);
				});

	            
			}
			$scope.getArray = $scope.uihp_update;
			console.log($scope.uihp_update);
        }

        $scope.filterChange = function(){
        	$scope.uihp_update = []; 
	        $scope.$watchCollection('EncounterBins', function () {
	            $scope.EncounterBinsResults = [];
	            
	        	var len = $scope.EncounterBins.length;
	             for(var i=0; i<len;i++){
	             	if($scope.EncounterBins[i].checked){
	            		$scope.EncounterBinsResults.push($scope.EncounterBins[i].type);
	            	}
	            }
	        });
	        $scope.$watchCollection('EncounterChargeBins', function () {
	            $scope.EncounterChargeBinsResults = [];
	            
	        	var len = $scope.EncounterChargeBins.length;
	             for(var i=0; i<len;i++){
	             	if($scope.EncounterChargeBins[i].checked){
	            		$scope.EncounterChargeBinsResults.push($scope.EncounterChargeBins[i].type);
	            	}
	            }
	        });
	        $scope.$watchCollection('DiseaseEncounterBins', function () {
	            $scope.DiseaseEncounterBinsResults = [];
	            
	        	var len = $scope.DiseaseEncounterBins.length;
	             for(var i=0; i<len;i++){
	             	if($scope.DiseaseEncounterBins[i].checked){
	            		$scope.DiseaseEncounterBinsResults.push($scope.DiseaseEncounterBins[i].type);
	            	}
	            }
	        });
			console.log($scope.uihp_data);

			leafletData.getMap().then(function(map) {

	           		map.removeLayer($scope.ZipCodeLayer);
	           		console.log(
	           			"After deleting zipcodelayer");

					$scope.ZipCodeLayer = new L.LayerGroup();

					$scope.checkGeojson = L.geoJson(ZIPCODES, 
	                    { 
                    		onEachFeature : onEachFeature,
                            style : style
	                    }).addTo($scope.ZipCodeLayer);
					map.addLayer($scope.ZipCodeLayer);
				});
			console.log("After filterchange");
            	// End of Changes for filter

        }

    	angular.extend($scope, {

			controls : {},
			legend : {
				colors : [],
				labels :[]
			}

		}); 

	}
]);