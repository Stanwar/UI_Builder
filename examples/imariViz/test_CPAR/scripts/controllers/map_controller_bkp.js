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
        // Adding custom 
        $scope.uihp_update = []; 
        $scope.ZipCodeLayer = new L.LayerGroup();
        $scope.checkGeojson = {};
        $scope.legendTotal = [];
        $scope.legendMax = [];
        $scope.getArray = [];
        $scope.filename ="check_cri";
        $scope.config_file = config_file;
        $scope.Sources = config_file[0].Sources;

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
        	Sources : 'UIHP'
        };

        $scope.sourceRadioModel = {
        	Eligible : false,
        	Enrolled : true
        }; 
        
		$scope.checkModel = {
			//ALL : true,
			IP: true,
			OP: false,
			NIPS: false
		};

		$scope.getScreenshot = function(){
			//GrabzIt("ZWVmYzY4ZmVjZGE5NGRkZGFhODYwNDQ5ZTA5NzkzYzA=").AddTo('insertCode', 'http://stanwa2.people.uic.edu/', {"delay": 1000, "format": "png"});
			"api.grabz.it/services/javascript.ashx?key=ZWVmYzY4ZmVjZGE5NGRkZGFhODYwNDQ5ZTA5NzkzYzA=&url=http://www.google.com"

		}
		$scope.diseaseModel = {
			//ALL : false,
			Asthma: true,
			Diabetes: false,
			SCD: false,
			Prematurity : false,
			NewbornInjury : false,
			Epilepsy : false
		};
        
		angular.extend($scope, {
			// Center on Chicago 
			chicago : {
				lat : 41.867490,
				lng : -87.633645,
				zoom : 12
			}, 
			// Map Defaults 
			defaults : {
				zoom: -10,
        		//scrollWheelZoom : false,
        		zoomControl: true,
		        //(this.mapURL2, {attribution: this.mapCopyright2});
		        //tileLayer: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
		        tileLayer : 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
		        attribution : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX',
		        //maxZoom: 14
			}
		});

			// Wait for center to be stablished
           leafletData.getMap().then(function(map) {

				var osmUrl= 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
				//'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
				var osmAttrib='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012';
				//var osm = new L.TileLayer(osmUrl, {minZoom: 2, maxZoom: 18, attribution: osmAttrib});
				//var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	
				L.geoJson(ZIPCODES, 
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
			 if($scope.sourceInitialModel == "Total" && $scope.sourceRadioModel == "Eligible"){
				uihp.total_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if($scope.sourceInitialModel == "Total" && $scope.sourceRadioModel == "Enrolled"){
				uihp.total_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "UIHP" && $scope.sourceRadioModel == "Eligible"){
				uihp.uihp_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "UIHP" && $scope.sourceRadioModel == "Enrolled"){
				uihp.uihp_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "Harmony" && $scope.sourceRadioModel == "Eligible"){
				uihp.harmony_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "Harmony" && $scope.sourceRadioModel == "Enrolled"){
				uihp.harmony_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
		}
		
		function getColor(d, max){
			//console.log("content : " + content );

			var bin = parseInt(max/7);
			//console.log("bin :" + bin + "max : " + max);
			////

	        return d > max-bin*1 ? '#800026' :
	               d > max-bin*2  ? '#BD0026' :
	               d > max-bin*3  ? '#E31A1C' :
	               d > max-bin*4  ? '#FC4E2A' :
	               d > max-bin*5   ? '#FD8D3C' :
	               d > max-bin*6   ? '#FEB24C' :
	                d > 1   ? '#FED976' :
	                    '#FFFFFF';
				return "yellow"
		}

	 	function onEachFeature(feature, layer){
			var t = feature.properties.ZIP;
		
			if(uihp_data){
				 
				uihp_data.forEach(function(d){
		            var Encounter = 0;
		            var total_disease_encounter = 0;

		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;
	                //console.log("Inside UIHP");
	                //console.log("t  +" + t);

	                var zip_content = {};

	                if (t == d.RecipientZip){
	                	 
	                	zip_content.Zip =d.RecipientZip;

	                	
	                	zip_content.Age ="UNDER";
	                	zip_content.Disease_Encounters = 0;
	                	zip_content.total_patient_charges =0;
	                	zip_content.total_patient_encounter = 0;
	                	zip_content.Asthma = 0;
	                	zip_content.Diabetes = 0;
	                	zip_content.SCD = 0;
	                	zip_content.Prematurity = 0;
	                	zip_content.Newborn = 0;
	                	zip_content.Epilepsy = 0;
						zip_content.IP_Charges = 0;
						zip_content.IP_encounter =0;
						zip_content.OP_Charges =0;
						zip_content.OP_encounter =0;
						zip_content.NIPS_Charges =0;
						zip_content.NIPS_encounter =0;

	                    $scope.diseaseResults.forEach( function(key){
	                        
	                        if(key == "Asthma"){
	                        	//console.log("d.Asthma : " + d.Asthma);
	                            Encounter = d.Asthma ;
	                        	zip_content.Asthma = parseInt(d.Asthma);
	                        }
	                        if(key == "Diabetes"){
	                        	//console.log("d.Diabetes : " + d.Diabetes);
	                            Encounter = d.Diabetes;
	                            zip_content.Diabetes = parseInt(d.Diabetes);
	                        }
	                        if(key == "SCD"){
	                        	//console.log("d.SCD : " + d.SCD);
	                            Encounter = d.SCD;
	                            zip_content.SCD = parseInt(d.SCD);
	                        }
	                        if(key == "Prematurity"){
	                        	//console.log("d.Prematurity : " + d.Prematurity);
	                            Encounter = d.Prematurity;
	                            zip_content.Prematurity = parseInt(d.Prematurity);
	                        }
	                        if(key == "NewbornInjury"){
	                        	//console.log("d.NewBorn : " + d.NewBorn);
	                            Encounter = d.NewBorn;
	                            zip_content.NewBorn = parseInt(d.NewBorn);
	                        }
	                        if(key == "Epilepsy"){
	                        	//console.log("d.Epilepsy : " +d.Epilepsy);
	                            Encounter = d.Epilepsy;
	                            zip_content.Epilepsy = parseInt(d.Epilepsy);
	                        }
	                        total_disease_encounter = parseInt(total_disease_encounter) + parseInt(Encounter);
	                    });
	                    $scope.checkResults.forEach(function (v){
	                    	
	                        if(v =="IP"){
	                            patient_encounter = parseInt(d.IP_encounters);
	                            patient_charges = parseInt(d.IP_charges);
	                            zip_content.IP_Charges = patient_charges;
	                            zip_content.IP_encounter = patient_encounter;
	                        }
	                        if(v =="OP"){
	                            patient_encounter = parseInt(d.OP_encounters);
	                            patient_charges = parseInt(d.OP_charges);
	                            zip_content.OP_Charges = patient_charges;
	                            zip_content.OP_encounter = patient_encounter;
	                        }
	                        if(v =="NIPS"){
	                            patient_encounter  = parseInt(d.NIPS_encounters);
	                            patient_charges = parseInt(d.NIPS_charges);
	                            zip_content.NIPS_Charges = patient_charges;
	                            zip_content.NIPS_encounter = patient_encounter;
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

		               
	                	
	                	zip_content.Disease_Encounters=total_disease_encounter;
	                	zip_content.total_patient_charges= total_patient_charges;
	                	zip_content.total_patient_encounter = total_patient_encounter ;

		                $scope.uihp_update.push(zip_content);
						layer.bindPopup(content);
	                }
        		
				});
			}
		    
		}	

		function style(feature){
			var t = feature.properties.ZIP;
		
			var style_calc = 0;
			var max = 0;
			if(uihp_data){
				uihp_data.forEach(function(d){
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

			///////
			return {
					fillColor : getColor(style_calc,$scope.legendMax[0]),
					weight : 2, 
					opacity : 1, 
					color : 'white',
					dashArray : '3',
					fillOpacity : .2
				};
		}
		/// Add object to an array for file pickup

		$scope.change = function(){
			

			if($scope.sourceInitialModel.Sources == "Total"
				|| $scope.sourceInitialModel.Sources == "UIHP"
				|| $scope.sourceInitialModel.Sources == "Harmony"){
				$scope.disableCheck = false;
			}
			$scope.uihp_update = []; 
			console.log(source);
			if($scope.sourceInitialModel == "Total" && $scope.sourceRadioModel == "Eligible"){
				uihp.total_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if($scope.sourceInitialModel == "Total" && $scope.sourceRadioModel == "Enrolled"){
				uihp.total_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "UIHP" && $scope.sourceRadioModel == "Eligible"){
				uihp.uihp_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "UIHP" && $scope.sourceRadioModel == "Enrolled"){
				uihp.uihp_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "Harmony" && $scope.sourceRadioModel == "Eligible"){
				uihp.harmony_eligible(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
			else if ($scope.sourceInitialModel == "Harmony" && $scope.sourceRadioModel == "Enrolled"){
				uihp.harmony_enrolled(function(data){
				    $scope.uihp = data;
				    uihp_data = data;
				});
			}
            var total_charges = 0 ;
            
            if(uihp_data){
            	// Getting all the elements of the parameter we are taking out heatmap for. 
            	var max_value = 0;
            	uihp_data.forEach(function(d){
            		var total_disease_encounter = 0;
            		var Encounter = 0;
		            var patient_encounter = 0;
		            var patient_charges = 0;
		            var total_patient_charges = 0 ;
		            var total_patient_encounter =0;
		            $scope.legendMax = [];
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
	                    }
	                    else if($scope.heatMapModel == "Patient_Charges") {
	                    	$scope.legendTotal.push(total_patient_charges);
							if(parseInt(max_value) <= parseInt(total_patient_charges)){
								max_value = total_patient_charges;
							}
							$scope.legendMax.push(max_value);
	                    }
	                    
					}
				})
				// console.log("The legend Total : " + $scope.legendTotal);
            }
            /* Get Results for all diseases for every zipcode. After that get IP/OP encounters and Charges for each Disease per Zipcode */
            //$scope.geojson.data = {};

            
           	
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

	        if($scope.sourceInitialModel && 
	        	($scope.sourceRadioModel == "Enrolled" || $scope.sourceRadioModel == "Eligible" ) ){

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
				legendData.colors = ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976'];
				var max = $scope.legendMax[0];
				var bin = parseInt(max/7);

				//legend.labels =[];
				// Adding Labels
				legendData.labels.push("> " + parseInt(max-bin*1));
				legendData.labels.push("> " + parseInt(max-bin*2));
				legendData.labels.push("> " + parseInt(max-bin*3));
				legendData.labels.push("> " + parseInt(max-bin*4));
				legendData.labels.push("> " + parseInt(max-bin*5));
				legendData.labels.push("> " + parseInt(max-bin*6));
				legendData.labels.push("> " + 1);
				for (var i = 0; i < legendData.colors.length; i++) {
					div.innerHTML +=
					'<div class="outline"><i style="background:' + legendData.colors[i] + '"></i></div>' +
					'<div class="info-label">' + legendData.labels[i] + '</div>';
				
				}

				legend.onAdd = function(map){
					return div;
				}

				legend.addTo(map);
				});

	            
			}
			$scope.getArray = $scope.uihp_update;
        }

        $scope.updateLegend = function(){


		    	angular.extend($scope, {

					
					legend : {
						colors: ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976']

					}

				}); 
        }
    	angular.extend($scope, {

			geojson : {
				data : ZIPCODES
			},
			controls : {},
			legend : {
				colors: ['#BD0026','#E31A1C','#FC4E2A','#FD8D3C','#FEB24C','#FED976','#FED976'],
				labels :[000000,000000,000000,000000,000000,000000,000000]
			}
/*
			leafletData.getMap().then(function(map){
				
			})*/
		}); 

	}
]);