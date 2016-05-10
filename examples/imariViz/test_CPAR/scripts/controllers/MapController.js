// MainController for the app 

angular.module('leafletApp').controller("mapController", ['$scope','$http', 'leafletData', 'uihp',
	function($scope,$http, leafletData,uihp){
		  
		/*
			Initializing variables. 
		*/  
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
        var defaultModeZip;
        var defaultModel_filter =[];

        // Data variables.
        var regularEngagedData;
        var regularEnrolledData;
        var defaultEngagedData;
        var defaultEnrolledData;
        $scope.zipCodeMap;
        $scope.EncounterBinsResults = [];
        $scope.DiseaseEncounterBinsResults = [];
        $scope.Marker_Locations = edit_centers;
        $scope.TableFieldNames = ['Zip'];

        // Adding custom 
        //$scope.uihp_update = []; 
        $scope.ZipCodeLayer = new L.LayerGroup();
        $scope.checkGeojson = {};
        $scope.legendTotal = [];
        $scope.legendMax = [];
        $scope.pChargeLegendMax = [];
        $scope.pEncounterLegendMax = [];
        $scope.dLegendMax = [];
        $scope.getArray = [];
        $scope.filename ="check_cri";
        /*
			Loading Config File. 
        */
        $scope.config_file = config_file;
        $scope.binDivide = 7;
 		$scope.patientsPerZip;
		$scope.disableMode = true;
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
		$scope.defaultModeModel = {
			//ALL : false,
			Asthma: true,
			Diabetes: false,
			SCD: false,
			Prematurity : false,
			NewbornInjury : false,
			Epilepsy : false
		};

		// End of Variable Initialization 
		$scope.fillColor = function(feature){

			if(feature.properties.name == 'Austin'){
				return {
					fillColor : 'blue',
					weight : 2, 
					opacity : 1, 
					color : 'black',
					dashArray : '3',
					fillOpacity : 0.7
				};
			}

			if(feature.properties.name == 'Lincoln Park'){
				return {
					fillColor : 'orange',
					weight : 2, 
					opacity : 1, 
					color : 'black',
					dashArray : '3',
					fillOpacity : 0.7
				};
			}
			return {
				fillColor : 'green',
				weight : 2, 
				opacity : 1, 
				color : 'black',
				dashArray : '3',
				fillOpacity : 0.3
			};
		}

		$scope.getScreenshot = function(){
			//GrabzIt("ZWVmYzY4ZmVjZGE5NGRkZGFhODYwNDQ5ZTA5NzkzYzA=").AddTo('insertCode', 'http://stanwa2.people.uic.edu/', {"delay": 1000, "format": "png"});
			"api.grabz.it/services/javascript.ashx?key=ZWVmYzY4ZmVjZGE5NGRkZGFhODYwNDQ5ZTA5NzkzYzA=&url=http://www.google.com"

		}
		/*
			Initialize Map , the Center and the locations on the map
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
			markers : edit_centers,

			layers : {
				baselayers : {
					osm : $scope.definedLayers.defaultChicago
				},
				overlays: {
                    chicagoLocations: {
                        name: "Chicago Locations",
                        type: "markercluster",
                        visible: false
                    }
                }
			}
		});

		// Wait for center to be stablished
       leafletData.getMap().then(function(map) {

			var osmUrl= 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
			//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
			var osmAttrib='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';
			
			$scope.zipcodes = L.geoJson(chicago, 
                {   
                        style : $scope.fillColor
                }).addTo($scope.ZipCodeLayer);

			$scope.ZipCodeLayer.addTo(map);


			// angular.extend($scope.controls, {
			//    minimap: {
			// 		type: 'minimap',
			// 		layer: {
			// 		   name: 'OpenStreetMap',
			// 		   url: osmUrl,
			// 		   type : 'xyz',
			// 		  // data : ZIPCODES
			// 			zoomLevelOffset : -16
			// 		},
			// 		toggleDisplay: true
			// 	}
			// });
			var control2 = new L.Control.Fullscreen();

			control2.addTo(map);

       });
		
		function getColor(d, max){
			var h = (1.0 - max/10) * 240;
  			return "hsl(" + h + ", 100%, 50%)";
		}

	 	function onEachFeature(feature, layer){
			var t = feature.properties.GEOID10;

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

		/*
			Style Function for creating custom style for Regular Mode. 
			This takes information from zipCodeMap and selects one attribute : Patient Encounters or Patient Charges
			and takes their value return a HSL Color  

		*/
		function style(feature){

			var t = feature.properties.GEOID10;

			var style_calc = 0;
			// Select which Regular Map Model to choose
			if(zipCodeMap !=null ){
				
				if(zipCodeMap.has(t)){


					if($scope.heatMapModel == "Patient_Encounter"){
						style_calc = zipCodeMap.get(t).get("Patient_Encounters");
					}else if($scope.heatMapModel =="Patient_Charges"){
						style_calc = zipCodeMap.get(t).get("Patient_Charges");
					}
				}
			}

			// Select color based 
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

            // Select color based
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
		// Getting Patient Information per Zipcode
		// uihp.patientsPerZip(function(data){
		// 	//console.log(data);

		//     $scope.patientsPerZip = data;
		// });

		/*
		 On Each Feature for Default Mode. This will create a pop-up for each zipcode we have information for. 
		 The pop-up consists of zipcode and number of unique patients for that particular zipcode
		*/
		function zipOnEachFeature(feature, layer){
			
			var t = feature.properties.GEOID10;

			var zipContent = {};
			if(defaultModeZip !=null ){
				
				if(defaultModeZip.has(t)){
					// Creating a bootstrap table for each pop up. 
					var content = "<table class='table table-hover'>"+ 
			                                    "<thead>" + 
			                                        "<tr>" + 
			                                            "<th> ZipCode :</th>"+
			                                            "<td>" + t + "</td>"+
			                                        "</tr>" + 
			                                    "</thead>" + 
			                                    "<tbody>" +
			                                        "<tr>" + 
			                                        "<th>Unique Patients:</th>"+
			                                            "<td>"+ numeral(defaultModeZip.get(t).get("UniquePatients").size).format('0.0a') +"</td>" + 
			                                        "</tr>"+
			                                    "</tbody>" + 
			                                "</table>";
		            zipContent.Zip = t;               
		            zipContent.UniquePatients = defaultModeZip.get(t).get("UniquePatients").size;
					
					// Push to json to create tabular report on page
					$scope.uihp_update.push(zipContent);

					// Bind to layer
		            layer.bindPopup(content);
				}
			}
			// var t = feature.properties.GEOID10;

			// if($scope.patientsPerZip != null){
			// 		$scope.patientsPerZip.forEach(function(d){
			// 			if(t == d.zip){
			// 				var content = "<table class='table table-hover'>"+ 
			// 			                                    "<thead>" + 
			// 			                                        "<tr>" + 
			// 			                                            "<th> ZipCode :</th>"+
			// 			                                            "<td>" + t + "</td>"+
			// 			                                        "</tr>" + 
			// 			                                    "</thead>" + 
			// 			                                    "<tbody>" +  "<tr>" + 
			// 			                                            "<th>Number of Enrolled Population:</th>"+
			// 			                                            "<td>" + numeral(d.Patient).format('0,0')  + "</td>"+
			// 			                                        "</tr>" +
			// 			                                    "</tbody>" + 
			// 			                                "</table>";
			// 			layer.bindPopup(content);
			// 		}
			// 	});
			// }
			
		}

		/*
			Select Color for Default Mode. The brackets are always created to be 10. 
		*/
		function getZipColor(d){

			var bracket = $scope.defaultPatientMax/10; 
			
			if(bracket< 3){
			 	return d > bracket * 9   ? '#800000': 
                    d > bracket * 8   ? '#A52A2A'  :
                    d > 0 ?  '#66CDAA' : 
                        '#FFFFFF';
			}else{
				//console.log("bracket : " + bracket);
				return d > bracket * 9   ? '#800000': 
	                    d > bracket * 8   ? '#A52A2A'  :
	                    d > bracket * 7 ? '#FF7F50' :
	                    d > bracket * 6 ? '#DC143C' :
	                    d > bracket * 5 ? '#FF6347' :
	                    d > bracket * 4 ? '#FFD700' :
	                    d > bracket * 3 ? '#B8860B' :
	                    d > bracket * 2 ? '#F0E68C' :
	                    d > bracket * 1 ? '#556B2F' :
	                    d > 0 ?  '#66CDAA' : 
	                        '#FFFFFF';        
			}
			       	
		}
		
		/*
			Style Function for Default Mode. This will get the unique count of the matched zipcode.
		*/
		function zipStyle(feature){

			var t = feature.properties.GEOID10;
			var styleVal =-1;

			// Loop through the hashmap to get the zip and its respective unique patient count. 
			for (var [key, value] of defaultModeZip) {
				if(t == key){
					styleVal = value.get("UniquePatients").size;
				}
			}
			
			// Get color for the zipcode based on the style value which in this case of the patient count. 
			return {
						fillColor : getZipColor(styleVal),
						weight : 2, 
						opacity : 1, 
						color : 'black',
						dashArray : '3',
						fillOpacity : parseInt($scope.transparencyMax)/10
					};
			
		}
		// function zipStyle(feature){

		// 	var t = feature.properties.GEOID10;
		// 	var styleVal =-1;

		// 	$scope.patientsPerZip.forEach(function(d){
		// 		if(t == d.zip){
		// 			styleVal = d.Patient;
		// 		}
		// 	});
		// 	return {
		// 				fillColor : getZipColor(styleVal),
		// 				weight : 2, 
		// 				opacity : 1, 
		// 				color : 'black',
		// 				dashArray : '3',
		// 				fillOpacity : parseInt($scope.transparencyMax)/10
		// 			};
			
		// }

		// $scope.runMode = function(){
		// 	if($scope.modeModel == "Default"){
		// 		$scope.zipMode();
		// 		$scope.disableMode = true;
		// 	}else if( $scope.modeModel == "Regular"){
		// 		$scope.change();
		// 		$scope.disableMode = false;
				
		// 	}
		// }

		/*

		*/
		$scope.zipMode = function(){

			var max = 0;

			defaultModeZip.forEach(function(x){

				if(max < parseInt(x.get("UniquePatients").size)){
					max = parseInt(x.get("UniquePatients").size);
				}
			});
			$scope.defaultPatientMax = max;
			leafletData.getMap().then(function(map) {

					map.removeLayer($scope.ZipCodeLayer);
					

				$scope.ZipCodeLayer = new L.LayerGroup();

				$scope.checkGeojson = L.geoJson(chicago, 
			        { 
			    		onEachFeature : zipOnEachFeature
			            , style : zipStyle
			        }).addTo($scope.ZipCodeLayer);
				map.addLayer($scope.ZipCodeLayer);

			$("div").remove(".legend.leaflet-control");
			   
				var div = L.DomUtil.create('div', 'info legend');
				
				var legend = L.control();
				// declaring legend again 
				var legendData  = {
					colors : ['#800000','#A52A2A','#FF7F50','#DC143C','#FF6347', '#FFD700', '#B8860B','#F0E68C','#556B2F','#66CDAA'],
					labels : []
				}; 
				var bin = $scope.defaultPatientMax/10;
				var restrict = 1;
				if(bin<5){
					restrict = 6;
					var loop = 10;
					var legendData  = {
						colors : ['#800000','#A52A2A','#FF7F50','#DC143C','#66CDAA'],
						labels : []
					}; 
				}else{
					var loop = 10;
					var legendData  = {
						colors : ['#800000','#A52A2A','#FF7F50','#DC143C','#FF6347', '#FFD700', '#B8860B','#F0E68C','#556B2F','#66CDAA'],
						labels : []
					}; 
				}
				
// if(bracket< 5){
// 			 	return d > bracket * 9   ? '#800000': 
//                     d > bracket * 8   ? '#A52A2A'  :
//                     d > bracket * 7 ? '#FF7F50' :
//                     d > bracket * 6 ? '#DC143C' :
//                     d > 0 ?  '#66CDAA' : 
//                         '#FFFFFF';
// 			}
				
				for(var i = loop; i >= restrict; i--){
					
					if(restrict == 1){
						if(i==1){
							legendData.labels.push("> " + 0);
						}else{
							legendData.labels.push("> " + parseInt(bin*(i-1)));
						}
					}else{
						if(i==restrict){
							legendData.labels.push("> " + 0);
						}else{
							legendData.labels.push("> " + parseInt(bin*(i-1)));
						}
					}
					
					
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
		// $scope.zipMode = function(){


		// 	var max = 0;
		// 	$scope.patientsPerZip.forEach(function(d){

		// 		if(max < parseInt(d.Patient)){
		// 			max = parseInt(d.Patient);
		// 		}
		// 	});
		// 	$scope.defaultPatientMax = max;
		// 	leafletData.getMap().then(function(map) {

  //          		map.removeLayer($scope.ZipCodeLayer);
           		

		// 		$scope.ZipCodeLayer = new L.LayerGroup();

		// 		$scope.checkGeojson = L.geoJson(enrolled_zip, 
  //                   { 
  //               		onEachFeature : zipOnEachFeature,
  //                       style : zipStyle
  //                   }).addTo($scope.ZipCodeLayer);
		// 		map.addLayer($scope.ZipCodeLayer);

		// 	$("div").remove(".legend.leaflet-control");
	           
		// 		var div = L.DomUtil.create('div', 'info legend');
				
		// 		var legend = L.control();
		// 		// declaring legend again 
		// 		var legendData  = {
		// 			colors : ['#800000','#A52A2A','#FF7F50','#DC143C','#FF6347', '#FFD700', '#B8860B','#F0E68C','#556B2F','#66CDAA'],
		// 			labels : []
		// 		}; 
		// 		var bin = parseInt($scope.defaultPatientMax/10);
		// 		var loop = 10;

				
		// 		for(var i = loop; i >= 1; i--){
					
		// 			if(i==1){
		// 				legendData.labels.push("> " + 0);
		// 			}else{
		// 				legendData.labels.push("> " + parseInt(bin*(i-1)));
		// 			}
					
		// 		}
		// 		for (var i = 0; i < legendData.colors.length; i++) {
		// 			div.innerHTML +=
		// 			'<div class="outline"><i style="background:' + legendData.colors[i] + '"></i></div>' +
		// 			'<div class="info-label">' + legendData.labels[i] + '</div>';
					
		// 		}
		// 		// div.innerHTML += '<div class="print"><input type="button" onclick="window.print();" value="print"></div>';
		// 		legend.onAdd = function(map){
		// 			return div;
		// 		}

		// 		legend.addTo(map);
		// 	});

		// }

		/*
			This will update the tabular grid and recreate the columns and the data.
		*/
		/// Add object to an array for file pickup
		$scope.gridUpdate = function(modeName){
			$scope.TableFieldNames = [];

			$scope.TableFieldNames.push('Neighborhood');
			$scope.TableFieldNames.push('TeenBirthRate');
			$scope.TableFieldNames.push('Cancer');
			$scope.TableFieldNames.push('Diabetes');
			$scope.TableFieldNames.push('Infant');
			$scope.TableFieldNames.push('BelowPoverty');
			$scope.TableFieldNames.push('Income');
			$scope.TableFieldNames.push('Unemployment');
		}

		$scope.gridUpdate();

		$scope.tableData = function(){
			 $scope.uihp_update = [];
			information[0].data.forEach(function(d){
				var obj = {};
				obj.Neighborhood = d[9];
				obj.TeenBirthRate = +d[10];
				obj.Cancer = +d[18];
				obj.Diabetes = +d[20];
				obj.Infant = +d[22];
				obj.BelowPoverty = +d[31]
				obj.Income = +d[35];
				obj.Unemployment = +d[36];
				$scope.uihp_update.push(obj);
			});
			
		}

		$scope.tableData();
		/*
			Calling all Services to get all the data neeeded for the map. This is only called once. 
		*/

		$scope.serviceFunc = function(){
			// Get data from service based on whatever view is selected.
		
			uihp.new_regular_enrolled(function(data){
				$scope.regularEnrolledData = data;
				regularEnrolledData = data;
			});
			
			uihp.new_regular_engaged(function(data){
				$scope.regularEngagedData = data;
				regularEngagedData = data;
			});


			// Get data from service. 
			uihp.default_mode_engaged(function(data){
				$scope.defaultModel_filter = data;
				defaultEngagedData = data;
			});
			
			// Get data from service. 
			uihp.default_mode_enrolled(function(data){
				$scope.defaultModel_filter = data;
				defaultEnrolledData = data;
			});
			
		}

		$scope.serviceFunc();
		/*
			Creating function for making changes for the default tab. This will include adding new population types and 
			filtering based on Diseases
		*/

        angular.extend($scope, {

			controls : {},
			legend : {
				colors : [],
				labels :[]
			}

		}); 

	}
]);
