// MainController for the app 

angular.module('leafletApp').controller("mapController", ['$scope','$http', 'leafletData', 'uihp',
	function($scope,$http, leafletData,uihp){
		  
		var source; 
		var tracker = 0;
        var age;
        var encounter;
        var checkResults = [];
        var diseaseResults = [];
        var uihp_data ; 
        var disease_filter;
        $scope.EncounterBinsResults = [];
        $scope.DiseaseEncounterBinsResults = [];
        $scope.Marker_Locations = map_locations;
       
       //	$scope.vizDetails = vizDetails;
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
        
        //$scope.markers = new Array(map_locations);

        // $scope.markers.push({
        //             lat: leafEvent.latlng.lat,
        //             lng: leafEvent.latlng.lng,
        //             message: "My Added Marker"
        //         });
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
        $scope.Views = config_file[2].Views;
        $scope.View_Label = config_file[2].View_Label;

        // Show and hide Bins 
        $scope.mapControlCharge = false;
        $scope.mapControlDisease = false;
        $scope.mapControlEncounter = false;


//        $scope.EncounterBins = ;
        // Transparency Color Slider
        $scope.transparencyMin = 0;
        $scope.transparencyMax = 10;
		$scope.getHeader = function (){
			console.log("Inside Header");
		 	return [
		 		"ZipCode",
        		"Age",
        		"Disease_Encounters",
        		"Total_Patient_Charges",
        		"Total_Patient_Encounter" ,
        		"Asthma",
        		"Diabetes" ,
        		"SCD" ,
        		"Prematurity",
        		"Newborn" ,
        		"Epilepsy",
				"IP_Charges",
				"IP_encounter" ,
				"OP_encounter",
				"OP_encounter" ,
				"NIPS_Charges",
				"NIPS_encounter"
			]
		 };

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
        
		$scope.checkModel = {
			//ALL : true,
			IP: true,
			OP: false,
			NIPS: false
		};

		// $scope.showModal = function(){
		// 	$('.ui.modal').modal('show');
		// 	map.invalidateSize();
		// };
		$scope.getScreenshot = function(){
			//GrabzIt("ZWVmYzY4ZmVjZGE5NGRkZGFhODYwNDQ5ZTA5NzkzYzA=").AddTo('insertCode', 'http://stanwa2.people.uic.edu/', {"delay": 1000, "format": "png"});
			"api.grabz.it/services/javascript.ashx?key=ZWVmYzY4ZmVjZGE5NGRkZGFhODYwNDQ5ZTA5NzkzYzA=&url=http://www.google.com"

		}

		var osmUrl= 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
		//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		var osmAttrib='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';
				
		$scope.diseaseModel = {
			//ALL : false,
			Asthma: true,
			Diabetes: false,
			SCD: false,
			Prematurity : false,
			NewbornInjury : false,
			Epilepsy : false
		};
        
        // $scope.zipcodes = L.geoJson(ZIPCODES, 
        //             {   
        //                     style : {
        //                     	fillColor : "green",
								// weight : 2, 
								// opacity : 1, 
								// color : 'white',
								// //dashArray : '3',
								// fillOpacity : 0.3
        //                     }
        //             }).addTo($scope.ZipCodeLayer);

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
        // $scope.definedOverlays = {
        // 	locations : {
        // 		name : 'Chicago Locations',
        // 		type : "markercluster",
        // 		visible : "true"
        // 	}
        // };
    
    	// function addresses() {
    	// 	//var map = map_locations;

    	// 	var markers  = new Object();
    	// 	for(var i=0;i<map_locations;i++){
	    // 			markers.push(
			  //   				{
					// 			  layer: 'chicagoLocations',
				 //                  lat: map_locations[i].lat,
				 //                  lng: map_locations[i].lng,
				 //                  message : map_locations[i].message
			  //   				}
					// );
	    // 		}
    	// 	return markers;
    	// };

    	

    	// $http.get('check_community_partners.json').success(function(data) {
     //        // Loop through the 'locations' and place markers on the map
     //        angular.forEach(data.locations, function(location, key){

     //            var marker = L.marker([location.lat, location.lng]).addTo(chicagoLocations);

     //        });
     //    });

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

		$scope.updateColor = function(){
			 if($scope.sourceInitialModel.Sources == "Total" && $scope.sourceRadioModel.Views == "Eligible"){
				uihp.total_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if($scope.sourceInitialModel.Sources == "Total" && $scope.sourceRadioModel.Views == "Enrolled"){
				uihp.total_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel.Sources == "UIHP" && $scope.sourceRadioModel.Views == "Eligible"){
				uihp.uihp_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel.Sources == "UIHP" && $scope.sourceRadioModel.Views == "Enrolled"){
				uihp.uihp_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel.Sources == "Harmony" && $scope.sourceRadioModel.Views == "Eligible"){
				uihp.harmony_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel.Sources == "Harmony" && $scope.sourceRadioModel.Views == "Enrolled"){
				uihp.harmony_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
		}
		
		function getColor(d, max){
			//console.log("content : " + content );

			// var bin = parseInt(max/$scope.binDivide);
			// var binDivide = $scope.binDivide;
			//console.log("bin :" + bin + "max : " + max);
			////


			var h = (1.0 - max/10) * 240;



  			return "hsl(" + h + ", 100%, 50%)";
	        // return d > max-bin*1 ? "hsl(0, 100%, 50%)" :
	        //        d > max-bin*2  ? '#BD0026' :
	        //        d > max-bin*3  ? '#E31A1C' :
	        //        d > max-bin*4  ? '#FC4E2A' :
	        //        d > max-bin*5  ? '#FD8D3C' :
	        //        d > max-bin*6  ? '#FEB24C' :
	        //     	d >= 1   ? '#FED976' :
	        //             '#FFFFFF';
				//return "yellow"
		}

	 	function onEachFeature(feature, layer){
			var t = feature.properties.ZIP;
		
			if(uihp_data){
				 
				$scope.uihp_data.forEach(function(d){
		            var Encounter = 0;
		            var total_disease_encounter = 0;

		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;
	                //console.log("Inside UIHP");
	                //console.log("t  +" + t);

	                var zip_content = {};
	                
	                var count = true;

	               // if($scope.EncounterBinsResults.length === 0 && $scope.DiseaseEncounterBinsResults.length ===0 && $scope.EncounterChargeBinsResults.length ===0){
	                	count = false;
	                	// If there is no filter applied : 
	                	//Trying for first filter for now

	                	if (t == d.RecipientZip){
	                	 
		                	zip_content.Zip =d.RecipientZip;

		                	zip_content.Age = d.Age;
		                	zip_content.DisEnc = 0;
		                	zip_content.TotalCost =0;
		                	zip_content.TotalEnc = 0;
		                	zip_content.ASA = 0;
		                	zip_content.DIA = 0;
		                	zip_content.SCD = 0;
		                	zip_content.PREM = 0;
		                	zip_content.NBI = 0;
		                	zip_content.EPIL = 0;
					zip_content.IPCost = 0;
					zip_content.IPEnc =0;
					zip_content.OPCost =0;
					zip_content.OPEnc =0;
					zip_content.NIPSCost =0;
					zip_content.NIPSEnc =0;

		                    $scope.diseaseResults.forEach( function(key){
		                        
		                        if(key == "Asthma"){
		                        	//console.log("d.Asthma : " + d.Asthma);
		                            Encounter = d.Asthma ;
		                        	zip_content.ASA = parseInt(d.Asthma);
		                        }
		                        if(key == "Diabetes"){
		                        	//console.log("d.Diabetes : " + d.Diabetes);
		                            Encounter = d.Diabetes;
		                            zip_content.DIA = parseInt(d.Diabetes);
		                        }
		                        if(key == "SCD"){
		                        	//console.log("d.SCD : " + d.SCD);
		                            Encounter = d.SCD;
		                            zip_content.SCD = parseInt(d.SCD);
		                        }
		                        if(key == "Prematurity"){
		                        	//console.log("d.Prematurity : " + d.Prematurity);
		                            Encounter = d.Prematurity;
		                            zip_content.PREM = parseInt(d.Prematurity);
		                        }
		                        if(key == "NewbornInjury"){
		                        	//console.log("d.NewBorn : " + d.NewBorn);
		                            Encounter = d.NewBorn;
		                            zip_content.NBI = parseInt(d.NewBorn);
		                        }
		                        if(key == "Epilepsy"){
		                        	//console.log("d.Epilepsy : " +d.Epilepsy);
		                            Encounter = d.Epilepsy;
		                            zip_content.EPIL = parseInt(d.Epilepsy);
		                        }
		                        total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);
		                    });
		                    $scope.checkResults.forEach(function (v){
		                    	
		                        if(v =="IP"){
		                            patient_encounter = parseInt(d.IP_encounters);
		                            patient_charges = parseInt(d.IP_charges);
		                            zip_content.IPCost = patient_charges;
		                            zip_content.IPEnc = patient_encounter;
		                        }
		                        if(v =="OP"){
		                            patient_encounter = parseInt(d.OP_encounters);
		                            patient_charges = parseInt(d.OP_charges);
		                            zip_content.OPCost = patient_charges;
		                            zip_content.OPEnc = patient_encounter;
		                        }
		                        if(v =="NIPS"){
		                            patient_encounter  = parseInt(d.NIPS_encounters);
		                            patient_charges = parseInt(d.NIPS_charges);
		                            zip_content.NIPSCost = patient_charges;
		                            zip_content.NIPSEnc = patient_encounter;
		                        }
		                        total_patient_encounter = parseInt(total_patient_encounter) + parseInt(patient_encounter);
		                        total_patient_charges = parseInt(total_patient_charges) + parseInt(patient_charges);
		                    });
		                    
		            		var content = "<table class='table table-hover'>"+ 
			                                    "<thead>" + 
			                                        "<tr>" + 
			                                            "<th> ZipCode :</th>"+
			                                            "<td>" + d.RecipientZip + "</td>"+
			                                        "</tr>" + 
			                                    "</thead>" + 
			                                    "<tbody>" +  "<tr>" + 
			                                            "<th>Charges:</th>"+
			                                            "<td>" + numeral(total_patient_charges).format('$0,0.00')  + "</td>"+
			                                        "</tr>" +
			                                        "<tr>" + 
			                                        "<th>Encounters:</th>"+
			                                            "<td>"+ numeral(total_patient_encounter).format('0.0a') +"</td>" + 
			                                        "</tr>"+
			                                        "<tr>" + 
			                                        "<th>Ages</th>"+
			                                            "<td>" + d.Age + " 25</td>" + 
			                                        "</tr>" +
			                                        "<tr>" + 
			                                        "<th>Disease Encounters:</th>"+
			                                            "<td>"+ numeral(total_disease_encounter).format('0.0a') +"</td>" + 
			                                        "</tr>"+
			                                    "</tbody>" + 
			                                "</table>";
			                                $scope.Total_Content = total_patient_encounter;

			               
		                	
		                	zip_content.DisEnc=total_disease_encounter;
		                	zip_content.TotalCost= total_patient_charges;
		                	zip_content.TotalEnc = total_patient_encounter ;

			                $scope.uihp_update.push(zip_content);
							layer.bindPopup(content);
		                }
	                //}
	      //           else if ($scope.EncounterBinsResults.length > 0 
	      //           		|| $scope.DiseaseEncounterBinsResults.length > 0 
	      //           		|| $scope.EncounterChargeBinsResults.length > 0){
	      //           	if (t == d.RecipientZip){
	                	 
		     //            	zip_content.Zip =d.RecipientZip;

		     //            	zip_content.Age ="UNDER";
		     //            	zip_content.Disease_Encounters = 0;
		     //            	zip_content.total_patient_charges =0;
		     //            	zip_content.total_patient_encounter = 0;
		     //            	zip_content.Asthma = 0;
		     //            	zip_content.Diabetes = 0;
		     //            	zip_content.SCD = 0;
		     //            	zip_content.Prematurity = 0;
		     //            	zip_content.Newborn = 0;
		     //            	zip_content.Epilepsy = 0;
							// zip_content.IP_Charges = 0;
							// zip_content.IP_encounter =0;
							// zip_content.OP_Charges =0;
							// zip_content.OP_encounter =0;
							// zip_content.NIPS_Charges =0;
							// zip_content.NIPS_encounter =0;

		     //                $scope.diseaseResults.forEach( function(key){
		                        
		     //                    if(key == "Asthma"){
		     //                    	//console.log("d.Asthma : " + d.Asthma);
		     //                        Encounter = d.Asthma ;
		     //                    	zip_content.Asthma = parseInt(d.Asthma);
		     //                    }
		     //                    if(key == "Diabetes"){
		     //                    	//console.log("d.Diabetes : " + d.Diabetes);
		     //                        Encounter = d.Diabetes;
		     //                        zip_content.Diabetes = parseInt(d.Diabetes);
		     //                    }
		     //                    if(key == "SCD"){
		     //                    	//console.log("d.SCD : " + d.SCD);
		     //                        Encounter = d.SCD;
		     //                        zip_content.SCD = parseInt(d.SCD);
		     //                    }
		     //                    if(key == "Prematurity"){
		     //                    	//console.log("d.Prematurity : " + d.Prematurity);
		     //                        Encounter = d.Prematurity;
		     //                        zip_content.Prematurity = parseInt(d.Prematurity);
		     //                    }
		     //                    if(key == "NewbornInjury"){
		     //                    	//console.log("d.NewBorn : " + d.NewBorn);
		     //                        Encounter = d.NewBorn;
		     //                        zip_content.NewBorn = parseInt(d.NewBorn);
		     //                    }
		     //                    if(key == "Epilepsy"){
		     //                    	//console.log("d.Epilepsy : " +d.Epilepsy);
		     //                        Encounter = d.Epilepsy;
		     //                        zip_content.Epilepsy = parseInt(d.Epilepsy);
		     //                    }
		     //                    total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);
		     //                });
		     //                $scope.checkResults.forEach(function (v){
		                    	
		     //                    if(v =="IP"){
		     //                        patient_encounter = parseInt(d.IP_encounters);
		     //                        patient_charges = parseInt(d.IP_charges);
		     //                        zip_content.IP_Charges = patient_charges;
		     //                        zip_content.IP_encounter = patient_encounter;
		     //                    }
		     //                    if(v =="OP"){
		     //                        patient_encounter = parseInt(d.OP_encounters);
		     //                        patient_charges = parseInt(d.OP_charges);
		     //                        zip_content.OP_Charges = patient_charges;
		     //                        zip_content.OP_encounter = patient_encounter;
		     //                    }
		     //                    if(v =="NIPS"){
		     //                        patient_encounter  = parseInt(d.NIPS_encounters);
		     //                        patient_charges = parseInt(d.NIPS_charges);
		     //                        zip_content.NIPS_Charges = patient_charges;
		     //                        zip_content.NIPS_encounter = patient_encounter;
		     //                    }
		     //                    total_patient_encounter = parseInt(total_patient_encounter) + parseInt(patient_encounter);
		     //                    total_patient_charges = parseInt(total_patient_charges) + parseInt(patient_charges);
		     //                });
		                    
		     //        		var content = "<table class='table table-hover'>"+ 
			    //                                 "<thead>" + 
			    //                                     "<tr>" + 
			    //                                         "<th> ZipCode :</th>"+
			    //                                         "<td>" + d.RecipientZip + "</td>"+
			    //                                     "</tr>" + 
			    //                                 "</thead>" + 
			    //                                 "<tbody>" +  "<tr>" + 
			    //                                         "<th>Charges:</th>"+
			    //                                         "<td>" + numeral(total_patient_charges).format('$0,0.00')  + "</td>"+
			    //                                     "</tr>" +
			    //                                     "<tr>" + 
			    //                                     "<th>Encounters:</th>"+
			    //                                         "<td>"+ numeral(total_patient_encounter).format('0.0a') +"</td>" + 
			    //                                     "</tr>"+
			    //                                     "<tr>" + 
			    //                                     "<th>Ages</th>"+
			    //                                         "<td>" + d.Age + " 25</td>" + 
			    //                                     "</tr>" +
			    //                                     "<tr>" + 
			    //                                     "<th>Disease Encounters:</th>"+
			    //                                         "<td>"+ numeral(total_disease_encounter).format('0.0a') +"</td>" + 
			    //                                     "</tr>"+
			    //                                 "</tbody>" + 
			    //                             "</table>";
			    //                             $scope.Total_Content = total_patient_encounter;

			               
		     //            	/*var len= $scope.DiseaseEncounterBins.length;
		     //         		for(var i=0; i<len;i++){
				   //           	if($scope.DiseaseEncounterBins[i].checked){
				   //          		if(total_disease_encounter >= $scope.DiseaseEncounterBins[i].min && total_disease_encounter <= $scope.DiseaseEncounterBins[i].max){
					  //               	zip_content.Disease_Encounters=total_disease_encounter;
					  //               	zip_content.total_patient_charges= total_patient_charges;
					  //               	zip_content.total_patient_encounter = total_patient_encounter ;

						 //                $scope.uihp_update.push(zip_content);
							// 			layer.bindPopup(content);
				   //          		}
				   //          	}
				   //          }

				   //          var len= $scope.EncounterChargeBins.length;
		     //         		for(var i=0; i<len;i++){
				   //           	if($scope.EncounterChargeBins[i].checked){
				   //          		if(total_disease_encounter >= $scope.EncounterChargeBins[i].min && total_disease_encounter <= $scope.EncounterChargeBins[i].max){
					  //               	zip_content.Disease_Encounters=total_disease_encounter;
					  //               	zip_content.total_patient_charges= total_patient_charges;
					  //               	zip_content.total_patient_encounter = total_patient_encounter ;

						 //                $scope.uihp_update.push(zip_content);
							// 			layer.bindPopup(content);
				   //          		}
				   //          	}
				   //          }

				   //          var len= $scope.EncounterChargeBin.length;
		     //         		for(var i=0; i<len;i++){
				   //           	if($scope.DiseaseEncounterBins[i].checked){
				   //          		if(total_disease_encounter >= $scope.DiseaseEncounterBins[i].min && total_disease_encounter <= $scope.DiseaseEncounterBins[i].max){
					  //               	zip_content.Disease_Encounters=total_disease_encounter;
					  //               	zip_content.total_patient_charges= total_patient_charges;
					  //               	zip_content.total_patient_encounter = total_patient_encounter ;

						 //                $scope.uihp_update.push(zip_content);
							// 			layer.bindPopup(content);
				   //          		}
				   //          	}
				   //          }*/
	             			

		     //            }
	      //           }

	                
        		
				});
			}
		    
		}	

		function style(feature){
			var t = feature.properties.ZIP;
		
			var style_calc = 0;
			var max = 0;
			if(uihp_data){
				$scope.uihp_data.forEach(function(d){
		            var Encounter = 0;
		            var total_disease_encounter = 0;

		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;
	                //console.log("Inside UIHP");
	                //console.log("t  +" + t);
	                if (t == d.RecipientZip){
	                    $scope.diseaseResults.forEach( function(key){
	                        
	                        if(key == "Asthma"){
	                        	//console.log("d.Asthma : " + d.Asthma);
	                            Encounter = d.Asthma ;
	                        }
	                        if(key == "Diabetes"){
	                        	//console.log("d.Diabetes : " + d.Diabetes);
	                            Encounter = d.Diabetes;
	                        }
	                        if(key == "SCD"){
	                        	//console.log("d.SCD : " + d.SCD);
	                            Encounter = d.SCD;
	                        }
	                        if(key == "Prematurity"){
	                        	//console.log("d.Prematurity : " + d.Prematurity);
	                            Encounter = d.Prematurity;
	                        }
	                        if(key == "NewbornInjury"){
	                        	//console.log("d.NewBorn : " + d.NewBorn);
	                            Encounter = d.NewBorn;
	                        }
	                        if(key == "Epilepsy"){
	                        	//console.log("d.Epilepsy : " +d.Epilepsy);
	                            Encounter = d.Epilepsy;
	                        }
	                        total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);
	                    });
	                    $scope.checkResults.forEach(function (v){
	                    	
	                        if(v =="IP"){
	                            patient_encounter = parseInt(d.IP_encounters);
	                            patient_charges = parseInt(d.IP_charges);
	                        }
	                        if(v =="OP"){
	                            patient_encounter = parseInt(d.OP_encounters);
	                            patient_charges = parseInt(d.OP_charges);
	                        }
	                        if(v =="NIPS"){
	                            patient_encounter  = parseInt(d.NIPS_encounters);
	                            patient_charges = parseInt(d.NIPS_charges);
	                        }
	                        total_patient_encounter = parseInt(total_patient_encounter) + parseInt(patient_encounter);
	                        total_patient_charges = parseInt(total_patient_charges) + parseInt(patient_charges);
	                    });

						//layer.bindPopup(content);
						// Style Parameters
						if($scope.heatMapModel == "Patient_Encounter"){
							style_calc = total_patient_encounter;
						}else if($scope.heatMapModel =="Patient_Charges"){
							style_calc = total_patient_charges;
						}else if($scope.heatMapModel =="Disease_Encounter"){
							style_calc = total_disease_encounter;
						}
						
	                }
        			//max = ;
				});
			}
        	var len= $scope.DiseaseEncounterBins.length;
     		for(var i=0; i<len;i++){
             	if($scope.DiseaseEncounterBins[i].checked && $scope.heatMapModel =="Disease_Encounter"){
            		if(style_calc >= $scope.DiseaseEncounterBins[i].min && style_calc <= $scope.DiseaseEncounterBins[i].max){
	                				///////
						return {
								fillColor : getColor(style_calc,$scope.DiseaseEncounterBins[i].type),
								weight : 2, 
								opacity : 1, 
								color : 'black',
								dashArray : '3',
								fillOpacity : parseInt($scope.transparencyMax)/10
							};
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
			$scope.TableFieldNames.push('Age');
			if($scope.heatMapModel == "Disease_Encounter"){
				$scope.TableFieldNames.push('DisEnc');
			}
			if($scope.heatMapModel == "Patient_Charges"){
				$scope.TableFieldNames.push('TotalCost');
			}
			if($scope.heatMapModel == "Patient_Encounter"){
				$scope.TableFieldNames.push('TotalEnc');
			}
			
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
						$scope.TableFieldNames.push('OPCost');
						$scope.TableFieldNames.push('OPEnc');
					}else if($scope.checkResults[i] == 'NIPS'){
						$scope.TableFieldNames.push('NIPSCost');
						$scope.TableFieldNames.push('NIPSEnc');
					}
					
				}
			}
			
		}
		$scope.change = function(){

			$scope.gridUpdate();
			if($scope.sourceInitialModel.Sources == "Total"
				|| $scope.sourceInitialModel.Sources == "UIHP"
				|| $scope.sourceInitialModel.Sources == "Harmony"){
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
			else if($scope.sourceInitialModel.Sources == "Total" && $scope.sourceRadioModel.Views == "Enrolled"){
				uihp.total_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				    $scope.uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel.Sources == "UIHP" && $scope.sourceRadioModel.Views == "Eligible"){
				uihp.uihp_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				    $scope.uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel.Sources == "UIHP" && $scope.sourceRadioModel.Views == "Enrolled"){
				uihp.uihp_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				    $scope.uihp_data = data;

				});
			}
			else if ($scope.sourceInitialModel.Sources == "Harmony" && $scope.sourceRadioModel.Views == "Eligible"){
				uihp.harmony_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				    $scope.uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel.Sources == "Harmony" && $scope.sourceRadioModel.Views == "Enrolled"){
				uihp.harmony_enrolled(function(data){
				    $scope.uihp = data;

				    uihp_data = data;
				    $scope.uihp_data = data;
				});
			}
            var total_charges = 0 ;
            
            if(uihp_data){
            	//uihp_data = $scope.uihp_data;
            	// Getting all the elements of the parameter we are taking out heatmap for. 
            	var max_value = 0;
            	$scope.uihp_data.forEach(function(d){
            		var total_disease_encounter = 0;
            		var Encounter = 0;
		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;

		            /////////
		            ///
		            ////////
		            $scope.legendMax = [];
		            $scope.dLegendMax = [];
		            $scope.pChargeLegendMax = [];
		            $scope.pEncounterLegendMax = [];
            		if($scope.heatMapModel == "Disease_Encounter"){
            			
						$scope.diseaseResults.forEach( function(key){

							if(key == "Asthma"){
	                        	//console.log("d.Asthma : " + d.Asthma);
	                            Encounter = d.Asthma ;
	                        }
	                        if(key == "Diabetes"){
	                        	//console.log("d.Diabetes : " + d.Diabetes);
	                            Encounter = d.Diabetes;
	                        }
	                        if(key == "SCD"){
	                        	//console.log("d.SCD : " + d.SCD);
	                            Encounter = d.SCD;
	                        }
	                        if(key == "Prematurity"){
	                        	//console.log("d.Prematurity : " + d.Prematurity);
	                            Encounter = d.Prematurity;
	                        }
	                        if(key == "NewbornInjury"){
	                        	//console.log("d.NewBorn : " + d.NewBorn);
	                            Encounter = d.NewBorn;
	                        }
	                        if(key == "Epilepsy"){
	                        	//console.log("d.Epilepsy : " +d.Epilepsy);
	                            Encounter = d.Epilepsy;
	                        }
	                        total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);

						})
						$scope.legendTotal.push(total_disease_encounter);
						if(parseInt(max_value) <= parseInt(total_disease_encounter)){
							max_value = total_disease_encounter;
						}
						$scope.legendMax.push(max_value);
						$scope.dLegendMax.push(max_value);
					}
					else{
	                    $scope.checkResults.forEach(function (v){
		                    	
	                        if(v =="IP"){
	                            patient_encounter = parseInt(d.IP_encounters);
	                            patient_charges = parseInt(d.IP_charges);
	                        }
	                        if(v =="OP"){
	                            patient_encounter = parseInt(d.OP_encounters);
	                            patient_charges = parseInt(d.OP_charges);
	                        }
	                        if(v =="NIPS"){
	                            patient_encounter  = parseInt(d.NIPS_encounters);
	                            patient_charges = parseInt(d.NIPS_charges);
	                        }
	                        total_patient_encounter = parseInt(total_patient_encounter) + parseInt(patient_encounter);
	                        total_patient_charges = parseInt(total_patient_charges) + parseInt(patient_charges);
	                    });

	                    if($scope.heatMapModel == "Patient_Encounter"){

	                    	$scope.legendTotal.push(total_patient_encounter);
							if(parseInt(max_value) <= parseInt(total_patient_encounter)){
								max_value = total_patient_encounter;
							}
							$scope.legendMax.push(max_value);
							$scope.pEncounterLegendMax.push(max_value);
	                    }
	                    else if($scope.heatMapModel == "Patient_Charges") {
	                    	$scope.legendTotal.push(total_patient_charges);
							if(parseInt(max_value) <= parseInt(total_patient_charges)){
								max_value = total_patient_charges;
							}
							$scope.legendMax.push(max_value);
							$scope.pChargeLegendMax.push(max_value);
	                    }
	                    
					}
 
				})
				// console.log("The legend Total : " + $scope.legendTotal);
				var max_value3 = 0;
				$scope.uihp_data.forEach(function(d){
            		var total_disease_encounter = 0;
            		var Encounter = 0;
		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;

		            /////////
		            ///
		            ////////
		            
		            $scope.dLegendMax = [];
		            
					$scope.diseaseResults.forEach( function(key){

						if(key == "Asthma"){
                        	//console.log("d.Asthma : " + d.Asthma);
                            Encounter = d.Asthma ;
                        }
                        if(key == "Diabetes"){
                        	//console.log("d.Diabetes : " + d.Diabetes);
                            Encounter = d.Diabetes;
                        }
                        if(key == "SCD"){
                        	//console.log("d.SCD : " + d.SCD);
                            Encounter = d.SCD;
                        }
                        if(key == "Prematurity"){
                        	//console.log("d.Prematurity : " + d.Prematurity);
                            Encounter = d.Prematurity;
                        }
                        if(key == "NewbornInjury"){
                        	//console.log("d.NewBorn : " + d.NewBorn);
                            Encounter = d.NewBorn;
                        }
                        if(key == "Epilepsy"){
                        	//console.log("d.Epilepsy : " +d.Epilepsy);
                            Encounter = d.Epilepsy;
                        }
                        total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);

					})

					//$scope.legendTotal.push(total_disease_encounter);
					if(parseInt(max_value3) <= parseInt(total_disease_encounter)){
						max_value3 = total_disease_encounter;
					}
					//$scope.legendMax.push(max_value);
					$scope.dLegendMax.push(max_value3);        
				})
					var max_value = 0;
					var max_value2 = 0;
				$scope.uihp_data.forEach(function(d){

					var total_disease_encounter = 0;
            		var Encounter = 0;
		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;

		            /////////
		            ///
		            ////////
		            
		            $scope.pChargeLegendMax = [];
		            $scope.pEncounterLegendMax = [];
					$scope.checkResults.forEach(function (v){
	                    	
                        if(v =="IP"){
                            patient_encounter = parseInt(d.IP_encounters);
                            patient_charges = parseInt(d.IP_charges);
                        }
                        if(v =="OP"){
                            patient_encounter = parseInt(d.OP_encounters);
                            patient_charges = parseInt(d.OP_charges);
                        }
                        if(v =="NIPS"){
                            patient_encounter  = parseInt(d.NIPS_encounters);
                            patient_charges = parseInt(d.NIPS_charges);
                        }
                        total_patient_encounter = parseInt(total_patient_encounter) + parseInt(patient_encounter);
                        total_patient_charges = parseInt(total_patient_charges) + parseInt(patient_charges);
                    });

                    
                	//$scope.legendTotal.push(total_patient_encounter);
					if(parseInt(max_value) <= parseInt(total_patient_encounter)){
						max_value = total_patient_encounter;
					}
					//$scope.legendMax.push(max_value);
					$scope.pEncounterLegendMax.push(max_value);
                
                	//$scope.legendTotal.push(total_patient_charges);
					if(parseInt(max_value2) <= parseInt(total_patient_charges)){
						max_value2 = total_patient_charges;
					}
					//$scope.legendMax.push(max_value);
					$scope.pChargeLegendMax.push(max_value2);
				})

				if($scope.heatMapModel == "Disease_Encounter"){
					$scope.mapControlDisease = true;
					$scope.mapControlCharge = false;
					$scope.mapControlEncounter = false;
				}else if($scope.heatMapModel == "Patient_Charges"){
					$scope.mapControlEncounter = false;
					$scope.mapControlDisease = false;
					$scope.mapControlCharge = true;
				}else if($scope.heatMapModel == "Patient_Encounter"){
					$scope.mapControlCharge = false;
					$scope.mapControlDisease = false;
					$scope.mapControlEncounter = true;
				}
            }
            /* Get Results for all diseases for every zipcode. After that get IP/OP encounters and Charges for each Disease per Zipcode */
            //$scope.geojson.data = {};

   //          /*
			// 	Creating EncounterBins for different encounter types 
   //          */
   //          var max = $scope.legendMax[0];
			// var binSize = parseInt(max/$scope.filterbin);

           	
            $scope.$watchCollection('sourceInitialModel',function(){
				source = $scope.sourceRadioModel;
			//            console.log($scope.sourceRadioModel);          
			})

            $scope.$watchCollection('ageRadioModel', function() {
	            age = $scope.ageRadioModel;
	        });

	        $scope.$watchCollection('diseaseModel', function () {
	            $scope.diseaseResults = [];
	            angular.forEach($scope.diseaseModel, function (value, key) {
	                if (value) {
	                    console.log(key);
	                    diseaseResults.push(key);
	                    $scope.diseaseResults.push(key);
	                }
	            });
	        });

	        $scope.$watchCollection('checkModel', function () {
	            $scope.checkResults = [];
	            angular.forEach($scope.checkModel, function (value, key) {
	                if (value) {
	                    console.log(key);
	                    checkResults.push(key);
	                    $scope.checkResults.push(key);
	                }
	            });
	        });

	        if($scope.sourceInitialModel.Sources && 
	        	($scope.sourceRadioModel.Views == "Enrolled" || $scope.sourceRadioModel.Views == "Eligible" ) ){

	        	var max = $scope.pEncounterLegendMax[0];

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
		        			checked : false
		        		});
					}
					else {
						$scope.EncounterBins.push(
		        		{
		        			"Bin" : parseInt(max-(BS*BD)) + " - " + parseInt(max-(BS*(BD-1)) - 1),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) - 1),
		        			checked : false
		        		});
					}
					fc = 1;
	        		BD = BD - 1;
	        		console.log("BD :" + BD);
	        	}
	        	// $scope.EncounterBins = [];
	        	// var binSize = parseInt(max/7);
	        	// $scope.EncounterBins.push(
	        	// 	{
	        	// 		"Bin" : parseInt(1) + " - " + parseInt(max-binSize*6 - 1),
	        	// 		"type" : "One",
	        	// 		"min" : 1,
	        	// 		"max" : parseInt(max-binSize*6 - 1),
	        	// 		checked : true
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*6) + " - " + parseInt(max-binSize*5 - 1),
	        	// 		"type" : "Two",
	        	// 		"min" : parseInt(max-binSize*6),
	        	// 		"max" : parseInt(max-binSize*5 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*5) + " - " + parseInt(max-binSize*4 - 1),
	        	// 		"type" : "Three",
	        	// 		"min" : parseInt(max-binSize*5),
	        	// 		"max" : parseInt(max-binSize*4 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*4) + " - " + parseInt(max-binSize*3 - 1),
	        	// 		"type" : "Four",
	        	// 		"min" : parseInt(max-binSize*4),
	        	// 		"max" : parseInt(max-binSize*3 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*3) + " - " + parseInt(max-binSize*2 - 1),
	        	// 		"type" : "Five",
	        	// 		"min" : parseInt(max-binSize*3),
	        	// 		"max" : parseInt(max-binSize*2 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*2) + " - " + parseInt(max-binSize*1 - 1),
	        	// 		"type" : "Six",
	        	// 		"min" : parseInt(max-binSize*2),
	        	// 		"max" : parseInt(max-binSize - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize) + " - " + parseInt(max),
	        	// 		"type" : "Seven",
	        	// 		"min" : parseInt(max-binSize),
	        	// 		"max" : parseInt(max),
	        	// 		checked : false
	        	// 	}
	        	// );

	        	var max = $scope.pChargeLegendMax[0];

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
		        			checked : false
		        		});
					}
					else {
						$scope.EncounterChargeBins.push(
		        		{
		        			"Bin" : numeral(parseInt(max-(BS*BD))).format('($ 0.00 a)') + " - " + numeral(parseInt(max-(BS*(BD-1)) - 1)).format('($ 0.00 a)'),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) - 1),
		        			checked : false
		        		});
					}
					fc = 1;
	        		BD = BD - 1;
	        		//console.log("BD :" + BD);
	        	}
	        	// $scope.EncounterChargeBins.push(
	        	// 	{
	        	// 		"Bin" : parseInt(1) + " - " + parseInt(max-binSize*6 - 1),
	        	// 		"type" : "One",
	        	// 		"min" : 1,
	        	// 		"max" : parseInt(max-binSize*6 - 1),
	        	// 		checked : true
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*6) + " - " + parseInt(max-binSize*5 - 1),
	        	// 		"type" : "Two",
	        	// 		"min" : parseInt(max-binSize*6),
	        	// 		"max" : parseInt(max-binSize*5 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*5) + " - " + parseInt(max-binSize*4 - 1),
	        	// 		"type" : "Three",
	        	// 		"min" : parseInt(max-binSize*5),
	        	// 		"max" : parseInt(max-binSize*4 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*4) + " - " + parseInt(max-binSize*3 - 1),
	        	// 		"type" : "Four",
	        	// 		"min" : parseInt(max-binSize*4),
	        	// 		"max" : parseInt(max-binSize*3 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*3) + " - " + parseInt(max-binSize*2 - 1),
	        	// 		"type" : "Five",
	        	// 		"min" : parseInt(max-binSize*3),
	        	// 		"max" : parseInt(max-binSize*2 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*2) + " - " + parseInt(max-binSize*1 - 1),
	        	// 		"type" : "Six",
	        	// 		"min" : parseInt(max-binSize*2),
	        	// 		"max" : parseInt(max-binSize - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize) + " - " + parseInt(max),
	        	// 		"type" : "Seven",
	        	// 		"min" : parseInt(max-binSize),
	        	// 		"max" : parseInt(max),
	        	// 		checked : false
	        	// 	}
	        	// );
				
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
		        			checked : false
		        		});
					}
					else {
						$scope.DiseaseEncounterBins.push(
		        		{
		        			"Bin" : parseInt(max-(BS*BD)) + " - " + parseInt(max-(BS*(BD-1)) - 1),
		        			"type" : BD,
		        			"min" : parseInt(max-(BS*BD)),
		        			"max" : parseInt(max-(BS*(BD-1)) - 1),
		        			checked : false
		        		});
					}
					fc = 1;
	        		BD = BD - 1;
	        		console.log("BD :" + BD);
	        	}


	        	// $scope.DiseaseEncounterBins.push(
	        	// 	{
	        	// 		"Bin" : parseInt(1) + " - " + parseInt(max-binSize*6 - 1),
	        	// 		"type" : "One",
	        	// 		"min" : 1,
	        	// 		"max" : parseInt(max-binSize*6 - 1),
	        	// 		checked : true
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*6) + " - " + parseInt(max-binSize*5 - 1),
	        	// 		"type" : "Two",
	        	// 		"min" : parseInt(max-binSize*6),
	        	// 		"max" : parseInt(max-binSize*5 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*5) + " - " + parseInt(max-binSize*4 - 1),
	        	// 		"type" : "Three",
	        	// 		"min" : parseInt(max-binSize*5),
	        	// 		"max" : parseInt(max-binSize*4 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*4) + " - " + parseInt(max-binSize*3 - 1),
	        	// 		"type" : "Four",
	        	// 		"min" : parseInt(max-binSize*4),
	        	// 		"max" : parseInt(max-binSize*3 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*3) + " - " + parseInt(max-binSize*2 - 1),
	        	// 		"type" : "Five",
	        	// 		"min" : parseInt(max-binSize*3),
	        	// 		"max" : parseInt(max-binSize*2 - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize*2) + " - " + parseInt(max-binSize - 1),
	        	// 		"type" : "Six",
	        	// 		"min" : parseInt(max-binSize*2),
	        	// 		"max" : parseInt(max-binSize - 1),
	        	// 		checked : false
	        	// 	},
	        	// 	{
	        	// 		"Bin" : parseInt(max-binSize) + " - " + parseInt(max),
	        	// 		"type" : "Seven",
	        	// 		"min" : parseInt(max-binSize),
	        	// 		"max" : parseInt(max),
	        	// 		checked : false
	        	// 	}
	        	// );

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
				var max = $scope.legendMax[0];
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

			/*
			Code being added to add extra filters for Charges, Encounters and Patient Encounters.
			*/
			// $scope.uihp_data = $scope.uihp_data.filter(function(obj){
			// 		return obj.Asthma >= $scope.DiseaseEncounterBins[0].min
			// 	                            && obj.Asthma <= $scope.DiseaseEncounterBins[0].max
			// 	                            ;
   //          });
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
					// Removing Legend 
	           
	   //          $("div").remove(".legend.leaflet-control");
	           
	            
				// var div = L.DomUtil.create('div', 'info legend');
				
				// var legend = L.control();
				// // declaring legend again 
				// var legendData  = {
				// 	colors : [],
				// 	labels : []
				// }; 

				// // Color Array
				// legendData.colors = ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976'];
				// var max = $scope.legendMax[0];
				// var bin = parseInt(max/$scope.binDivide);

				// var loop = $scope.binDivide;
				// //legend.labels =[];
				// // Adding Labels

				// // legendData.labels.push("> " + parseInt(max-bin*1));
				// // legendData.labels.push("> " + parseInt(max-bin*2));
				// // legendData.labels.push("> " + parseInt(max-bin*3));
				// // legendData.labels.push("> " + parseInt(max-bin*4));
				// // legendData.labels.push("> " + parseInt(max-bin*5));
				// // legendData.labels.push("> " + parseInt(max-bin*6));
				// // legendData.labels.push("> " + 1);

				// // var i =1;
				// // while(i<=loop.length){
				// // 	if(i == loop.length){
				// // 		legendData.labels.push("> " + 1);
				// // 	}else{
				// // 		legendData.labels.push("> " + parseInt(max-bin*parseInt(i)));
				// // 	}
				// // 	i = i+1;
				// // }
				// // for (var i = 0; i < legendData.colors.length; i++) {
				// // 	div.innerHTML +=
				// // 	'<div class="outline"><i style="background:' + legendData.colors[i] + '"></i></div>' +
				// // 	'<div class="info-label">' + legendData.labels[i] + '</div>';
					
				// // }
				// div.innerHTML += '<div class="print"><input type="button" onclick="window.print();" value="print"></div>';
				// legend.onAdd = function(map){
				// 	return div;
				// }

				// legend.addTo(map);
				});
			console.log("After filterchange");
            	// End of Changes for filter

        }
        $scope.updateLegend = function(){


		    	angular.extend($scope, {

					
					legend : {
						colors: ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976']

					}

				}); 
        }


    	angular.extend($scope, {

			// geojson : {
			// 	data : ZIPCODES
			// },
			controls : {},
			legend : {
				colors : [],
				labels :[]
				//colors: ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976'],
				// labels :[000000,000000,000000,000000,000000,000000,000000]
			}
/*
			leafletData.getMap().then(function(map){
				
			})*/
		}); 

	}
]);
