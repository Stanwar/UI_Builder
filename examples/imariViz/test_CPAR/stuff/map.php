<!DOCTYPE html>
<html>

  <head>
    <script data-require="jquery@*" data-semver="2.0.3" src="../checkVizAngular/scripts/js/jquery.js"></script>

    <script data-require="bootstrap@*" data-semver="3.1.1" src="../checkVizAngular/bootstrap/js/bootstrap.js"></script>

    <script src="../checkVizAngular/scripts/js/sidebar.js"></script>

    <link data-require="bootstrap-css@3.1.1" data-semver="3.1.1" rel="stylesheet" href="../checkVizAngular/bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" href="../checkVizAngular/styles/style.css" />
    <link rel="stylesheet" href="../checkVizAngular/styles/sidebar.css" />
	<link rel="stylesheet" href="../checkVizAngular/styles/MarkerCluster.css" />
	<link rel="stylesheet" href="../checkVizAngular/styles/MarkerCluster.Default.css" />

	<title></title>

	<!-- StyleSheets -->
	<!-- <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" /> -->
	<link rel="stylesheet" href="../checkVizAngular/styles/leaflet.css" />
	<link rel="stylesheet" href="../checkVizAngular/leaflet_minimap/Control.MiniMap.css" />
	<link rel="stylesheet" href="../checkVizAngular/styles/mapStyle.css">
	<link rel="stylesheet" href="../checkVizAngular/Leaflet.fullscreen-gh-pages/src/leaflet.fullscreen.css">
	<link rel="stylesheet" href="../checkVizAngular/scripts/js/trNgGrid.css"/>
	<link rel="stylesheet" href="../checkVizAngular/styles/easyPrint.css"/>
	<link rel="stylesheet" href="../checkVizAngular/styles/angular.rangeSlider.css"/>
	<link rel="stylesheet" href="../checkVizAngular/styles/leaflet.awesome-markers.css"/>
	<!-- // <script src="../checkVizAngular/scripts/js/slider.js"></script> -->
     <!-- <script src="../checkVizAngular/scripts/js/leaflet.easyPrint.js"></script> -->

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular.min.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-route.min.js"></script>

	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.7/angular-resource.min.js"></script>
	<script src="../checkVizAngular/scripts/js/angular-sanitize.min.js"></script>
	<script src="../checkVizAngular/scripts/js/ng-csv.js"></script>

	<script src="../checkVizAngular/scripts/js/uiBootstrap.js"></script>
    <script src="../checkVizAngular/scripts/js/bootstrap-table.css"></script>
    <script src="../checkVizAngular/scripts/js/bootstrap-table.js"></script>

	<!-- // <script src="https://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"></script> -->
	<script src="../checkVizAngular/scripts/js/leaflet.js"></script>
	<script src="../checkVizAngular/leaflet_minimap/Control.MiniMap.js"></script>
	<script type="text/javascript" src="scripts/js/angular-simple-logger.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/numeral.js/1.4.5/numeral.min.js"></script>
	<script src="../checkVizAngular/Leaflet.fullscreen-gh-pages/src/Leaflet.fullscreen.js"></script>
	<script src="../checkVizAngular/scripts/js/trNgGrid.js"></script>
	<script src="../checkVizAngular/scripts/js/html2canvas.js"></script>
	<script src="../checkVizAngular/scripts/js/canvas2image.js"></script>
	<script src="../checkVizAngular/scripts/js/angular.rangeSlider.js"></script>
	<script src="../checkVizAngular/scripts/js/MarkerCluster.js"></script>
	<script src="../checkVizAngular/scripts/js/leaflet.markercluster-src.js"></script>
	<Script src="../checkVizAngular/scripts/js/leaflet.awesome-markers.js"></script>
	<Script src="../checkVizAngular/scripts/js/leaflet.awesome-markers.min.js"></script>
	<script src="../checkVizAngular/data/check_community_partners.js"></script>
	<script src="../checkVizAngular/data/vizDetails.js"></script>
	<!-- Bootstrap Modules --> 

	<script src="../checkVizAngular/angular-leaflet-directive-master/dist/angular-leaflet-directive.min.js"></script>
    
	<!-- Javascript Scripts --> 
	
	<script src="../checkVizAngular/data/chicago_map.js"></script>
	<script src="scripts/controllers/DataPHPController.js"></script>
	
	<!-- Services --> 
	<script src="scripts/services/data_uihp_service.js"></script>
	<!-- Modules -->
	<script src="scripts/app.js"></script>

	<!-- Controllers -->
	<script src="scripts/controllers/MapController.js"></script>
	<script src="scripts/controllers/ButtonsController.js"></script>
	<!-- Directives -->
	<!-- <script src="scripts/directives/leaflet_map.js"></script>-->
	<!-- Files -->
	<script src="../checkVizAngular/data/config_file.js"></script>
  </head>

  <body ng-app="leafletApp">
    <!-- Fixed navbar -->
	  <?php
                        session_start();
                        $uids = file('/var/www/netids.txt');
                        $uid=$_SESSION['uid'];
			if ($uid!=null)
		{
	  ?> 
    <div class="navbar navbar-static navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle toggle-left hidden-md hidden-lg" data-toggle="sidebar" data-target=".sidebar-left">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">CRI - CHECK </a>
        </div>
        <button type="button" class="navbar-toggle toggle-right" data-toggle="sidebar" data-target=".sidebar-right">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>

    </div>
    <!-- Begin page content -->
    <div class="container-fluid" ng-controller="mapController" ng-init>
    <!-- <button class="btn btn-default" ng-click="window.print()"> Button</button> -->
      <div class="row">
        <div class="main col-md-9 col-md-offset-3">
        <!-- LEAFLET Map Code --> 
			<div id="leafet_Map" >
				<div  id="LL">
				 <leaflet width="100%" markers="markers" layers="layers" height="480px" controls="controls" center="chicago" legend="legend" defaults="defaults" geojson="geojson"></leaflet>
				 </div>
					<!-- <p ng-controller="dataPHPController">
					{{ eligible }}
					</p>
					
					{{ ZIPCODES }}-->
					<!--<button type="button" class="btn btn-primary" ng-click="updateColor()" ng-model="singleModel" uib-btn-checkbox btn-checkbox-true="1" btn-checkbox-false="0">
        				Single Toggle
    				</button> --> 
	    			<div ng-controller="dataPHPController">
						<!--{{ uihp }}-->

						<!--{{ uihp }}-->
						<!-- <div ui-grid="gridoptions" class="grid" ui-grid-resize-columns ui-grid-move-columns></div> -->
				<table tr-ng-grid="" items="uihp_update" cell-width="10em" fields="TableFieldNames">
							
						</table>
					</div>
			</div>
        </div>

        <div class="col-xs-7 col-sm-3 col-md-3 sidebar sidebar-left sidebar-animate sidebar-md-show">
			<div>
				<!-- <button class="btn btn-lg btn-primary" ng-click="showModal()">Open the map in a modal</a></button> -->
				<ul class="list-unstyled">
					<!--<li ng-repeat="Header_Name in config_header" ng-model="Config.Headers" ng-value="Header_Name.Header_Name">
						<h4> 
							<label > 
								{{Header_Name.Header_Name}}
							</label>
						</h4>
						<div class="btn-group" ng-click="change()">
							<label ng-repeat="name in config_header.Header_Info" class="btn btn-primary" ng-model="Config.Header_Name" ng-value="name.name"
					uib-btn-radio="name.name">{{name.name}}</label>
						</div>

					</li>-->
					<li><h4> <label title="{{Source_Label}}">Sources</label> </h4></li>
					<div class="btn-group" ng-click="change()">
						<!-- <label class="btn btn-primary" ng-model="sourceInitialModel" uib-btn-radio="'Total'">Total</label>
						<label class="btn btn-primary" ng-model="sourceInitialModel" uib-btn-radio="'UIHP'">UIHP</label>
						<label class="btn btn-primary" ng-model="sourceInitialModel" uib-btn-radio="'Harmony'">Harmony</label> -->
						<div class="btn-group" ng-click="change()" >
					<!-- 	<label class="btn btn-primary" ng-model="sourceInitialModel" uib-btn-radio="'Total'">Total</label>
						<label class="btn btn-primary" ng-model="sourceInitialModel" uib-btn-radio="'UIHP'">UIHP</label>
						<label class="btn btn-primary" ng-model="sourceInitialModel" uib-btn-radio="'Harmony'">Harmony</label> -->
						
						  
						<label ng-repeat="name in Sources" class="btn btn-primary" ng-model="sourceInitialModel.Sources" ng-value="name.name" title={{name.title}}
						uib-btn-radio="name.name">{{name.name}}</label>
						  <!-- 
						<label class="btn btn-primary" ng-model="sourceInitialModel" uib-btn-radio="'UIHP'">UIHP</label>
						<label class="btn btn-primary" ng-model="sourceInitialModel" uib-btn-radio="'Harmony'">Harmony</label> -->
						
					</div>
					</div>
					<li><h4> <label title="{{View_Label}}"> Views </label></h4></li>
					<div class="btn-group" ng-click="change()">
						<!-- <label class="btn btn-primary" ng-model="sourceRadioModel" uib-btn-radio="'Eligible'" ng-disabled="disableCheck">Eligible</label>
						<label class="btn btn-primary" ng-model="sourceRadioModel" uib-btn-radio="'Enrolled'" ng-disabled="disableCheck">Enrolled</label> -->
						<label ng-repeat="name in Views" class="btn btn-primary" ng-model="sourceRadioModel.Views" ng-value="name.view_name" title={{name.title}}
						uib-btn-radio="name.view_name" ng-disabled="disableCheck">{{name.view_name}}</label>
					</div>
					<!--
					<li><h4> <label title="{{Age_Label}}">Age </label></h4></li>
						<div class="btn-group" ng-click="change()">
							<label class="btn btn-primary" ng-model="ageRadioModel" uib-btn-radio="'Total'"  ng-disabled="disableCheck">Total</label>
							<label class="btn btn-primary" ng-model="ageRadioModel" uib-btn-radio="'Under'"  ng-disabled="disableCheck">Under 25</label>
							<label class="btn btn-primary" ng-model="ageRadioModel" uib-btn-radio="'Above'"  ng-disabled="disableCheck">Above 25</label>
						</div>
					<li><h4> 
					-->
					<!-- <label title="{{Encounter_Label}}">Encounters</label> </h4></li> -->
					<li><h4><label>Service Categories</label> </h4></li>
						<div class="btn-group" ng-click="change()">
							<!--<label class="btn btn-primary" ng-model="checkModel.ALL" uib-btn-checkbox>ALL</label>-->
							<label class="btn btn-primary" ng-model="checkModel.IP" uib-btn-checkbox uncheckable  ng-disabled="disableCheck" title="Inpatient">IP</label>
							<label class="btn btn-primary" ng-model="checkModel.OP" uib-btn-checkbox uncheckable  ng-disabled="disableCheck" title="Outpatient"> OP</label>
							<label class="btn btn-primary" ng-model="checkModel.NIPS" uib-btn-checkbox uncheckable  ng-disabled="disableCheck" title="Non-Institutional Provider Services (OutPatient or Third Party)">NIPS</label>
						</div>
						<li ng-show="mapControlEncounter"><h5><label title="Global view based on Total Encounters"> Patient Encounters </label></h5></li>
						<div class="btn-group" ng-click="filterChange()"  ng-show="mapControlEncounter">
							<label ng-repeat="name in EncounterBins" class="btn btn-info" uib-btn-checkbox="name.Bin" ng-model="name.checked" uncheckable>{{name.Bin}}</label>
						</div>
						<li  ng-show="mapControlCharge"><h5><label title="Global view based on Total Cost"> Patient Charges </label></h5></li>
						<div class="btn-group" ng-click="filterChange()"  ng-show="mapControlCharge">
							<label ng-repeat="name in EncounterChargeBins" class="btn btn-info" uib-btn-checkbox="name.Bin" ng-model="name.checked" uncheckable>{{name.Bin}}</label>
						</div>
					<li><h4> <label title="Global view based on Disease Specific Encounters">Diseases </label></h4></li>
						<div class="btn-group" ng-click="change()" >
							<!--<label class="btn btn-primary" ng-model="diseaseModel.ALL" uib-btn-checkbox>All</label>-->
							<label class="btn btn-primary" ng-model="diseaseModel.Asthma" uib-btn-checkbox uncheckable  ng-disabled="disableCheck">Asthma</label>
							<label class="btn btn-primary" ng-model="diseaseModel.Diabetes" uib-btn-checkbox uncheckable  ng-disabled="disableCheck">Diabetes</label>
							<label class="btn btn-primary" ng-model="diseaseModel.SCD" uib-btn-checkbox uncheckable  ng-disabled="disableCheck">SCD</label>
							<label class="btn btn-primary" ng-model="diseaseModel.Epilepsy" uib-btn-checkbox uncheckable  ng-disabled="disableCheck">Epilepsy</label>
							<label class="btn btn-primary" ng-model="diseaseModel.NewbornInjury" uib-btn-checkbox uncheckable  ng-disabled="disableCheck">NewbornInjury</label>
							<label class="btn btn-primary" ng-model="diseaseModel.Prematurity" uib-btn-checkbox uncheckable  ng-disabled="disableCheck">Prematurity</label>
						</div>
						<div class="btn-group" ng-click="filterChange()" ng-show="mapControlDisease">
							<label ng-repeat="name in DiseaseEncounterBins" class="btn btn-info" ng-model="name.checked" uib-btn-checkbox="name.Bin" uncheckable>{{name.Bin}}</label>
						</div>
					<li><h4> <label title="{{Map_Label}}">Map Controls </label></h4></li>

						<div class="btn-group" ng-click="change()">
							<label class="btn btn-success" ng-model="heatMapModel" uib-btn-radio="'Patient_Encounter'" ng-disabled="disableCheck">Patient_Encounter</label>
							<label class="btn btn-success" ng-model="heatMapModel" uib-btn-radio="'Patient_Charges'" ng-disabled="disableCheck">Patient_Charges</label>
							<label class="btn btn-success" ng-model="heatMapModel" uib-btn-radio="'Disease_Encounter'" ng-disabled="disableCheck">Disease_Encounters</label>
							<!-- <slider ng-model="sliders.sliderValue" min="testOptions.min" step="testOptions.step" max="testOptions.max" value="testOptions.value"></slider> -->
						
						</div>
					<li><h4> <label>Number of Bins </label></h4></li>
					<label class="btn btn-default" ng-click="change()" title="Maximum 10 bins">Change Bin</label><input type="text" id="binSize" class="form-control" ng-model="binDivide">
						<br>
					<li><h4> <label title="Transparency">Transparency</label></h4></li>	
						<div ng-click="filterChange()" range-slider min="0" max="10" model-min="transparencyMin" model-max="transparencyMax" step="1" pin-handle="min" attach-handle-values="true"></div>
				</ul>
				
				
				<!-- 
				<h4> Views </h4>
				<div class="btn-group">
					<label class="btn btn-primary" ng-model="radioModel" uib-btn-radio="'ZipCodes'">Left</label>
					<label class="btn btn-primary" ng-model="radioModel" uib-btn-radio="'Eligible'">Middle</label>
					<label class="btn btn-primary" ng-model="radioModel" uib-btn-radio="'Enrolled'">Right</label>
				</div>
				-->
			</div>
		</div>
		<!-- Hidden NavBar --> 
		<!-- All the map controls to be put in this --> 
        <div class="col-xs-7 col-sm-3 col-md-3 sidebar sidebar-right sidebar-animate">
			<div>
				<ul class="list-unstyled">
					<li><h4>Enter Filename</h4></li>
	    			<input type="text" id="filename" class="form-control" ng-model="filename">
					<button class="btn btn-default" ng-csv="getArray" filename="{{ filename }}.csv" csv-header="getHeader()">Export To File</button>
					<!-- <button class="btn btn-default" ng-click="getScreenshot()">Screenshot</button> -->
					<label class="btn btn-default" ><a href="../checkVizAngular/data/" download="README.txt">Download README</a></label>
					<!-- <input type="button" id="btnSave" value="Save PNG"/>
					<canvas width="600" height="400" id="cvs"></canvas>
					<div id="img-out"></div> -->
					<li><h4>Table Legend</h4></li>
						<ul>
							<li> Zip - Zip </li> 
							<li> DIS_ENC - Disease Encounter</li>
							<li> TOTAL_ENC - Total Patient Encounter</li> 
							<li> TOTAL_COST - Total Patient Cost</li> 
							<li> ASA - Asthma</li> 
							<li> DIA - Diabetes</li>
							<li> SCD - Sickle Cell Disease</li>
							<li> PREM - Prematurity</li>
							<li> EPI - Epilepsy</li>
							<li> NBI - NewbornInjury</li>
							<li> IP_COST - IP Cost</li>
							<li> IP_ENC - IP Encounters</li>
							<li> OP_COST - OP Cost</li>
							<li> OP_ENC - OP Encounters</li>
							<li> NIPS_COST - NIPS Charges</li>
							<li> NIPS_ENC - NIPS Encounter</li>
						</ul>
				</ul>
			</div>
        </div>
   <!-- //      <script> 
   //      $(function() { 
			//     $("#btnSave").click(function() { 
			//         html2canvas($("#LL"), {
			//             onrendered: function(canvas) {
			//                 theCanvas = canvas;
			//                 document.body.appendChild(canvas);

			//                 // Convert and download as image 
			//                  Canvas2Image.saveAsPNG(canvas); 
			//                 // $("#img-out").append(canvas);
			//                 // Clean up 
			//                 //document.body.removeChild(canvas);
			//             }
			//         });
			//     });
			// }); 
   //      </script>-->
      </div>
    </div>
    <?php
	}
	else
	  echo "Sorry !! Please register with us to see this content";
	?>
  </body>

</html>
