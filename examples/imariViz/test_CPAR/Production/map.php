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
	<!-- <script src="../checkVizAngular/data/vizDetails.js"></script> -->
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
	<script>
		function Download(){
		  window.open('../checkVizAngular/data/readme.txt');
		}
	</script>
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
	    			<div ng-controller="dataPHPController">
						<table tr-ng-grid="" items="uihp_update" cell-width="10em" fields="TableFieldNames">
							
						</table>
					</div>
			</div>
        </div>

        <div class="col-xs-7 col-sm-3 col-md-3 sidebar sidebar-left sidebar-animate sidebar-md-show">
			<div>
				<!-- <button class="btn btn-lg btn-primary" ng-click="showModal()">Open the map in a modal</a></button> -->
				<ul class="list-unstyled">
					<li><h4> <label title="{{Source_Label}}">Sources</label> </h4></li>
					<div class="btn-group">
						<div ng-click="change()" ng-repeat="name in Sources">						  
							<h5> <span  style="padding-top:15px; padding-bottom:3px; padding-left:5px"><input type="radio" ng-model="sourceInitialModel.Sources" name={{name.name}} value={{name.name}} title={{name.title}}> {{name.name}}</h5>
						</div>
					</div>
					<li><h4> <label title="{{View_Label}}"> Views </label></h4></li>
					<div class="btn-group">
						<div ng-click="change()" ng-repeat="name in Views">
							<h5><input type="radio" ng-model="sourceRadioModel.Views" name={{name.name}} ng-value="name.view_name" title={{name.title}}> {{name.view_name}}</h5>
						</div>
					
					</div>
					<li><h4> <label title="{{Age_Label}}">Age </label></h4></li>
					<div ng-click="change()" range-slider min="0" max="30" model-min="ageMin" model-max="ageMax" step="1" attach-handle-values="true" show-values="true"></div>
					<div class="btn-group" ng-click="change()">

						<!-- <label class="btn btn-primary" ng-model="sourceRadioModel" uib-btn-radio="'Eligible'" ng-disabled="disableCheck">Eligible</label>
						<label class="btn btn-primary" ng-model="sourceRadioModel" uib-btn-radio="'Enrolled'" ng-disabled="disableCheck">Enrolled</label> -->
						<!-- <input type="checkbox" ng-model="ageRadioModel.one" uncheckable  ng-disabled="disableCheck" title="Inpatient">00 - 05 
						<input type="checkbox" ng-model="ageRadioModel.two" uncheckable  ng-disabled="disableCheck" title="Inpatient">06 - 10
						<input type="checkbox" ng-model="ageRadioModel.three" uncheckable  ng-disabled="disableCheck" title="Inpatient">11 - 15 
						<input type="checkbox" ng-model="ageRadioModel.four" uncheckable  ng-disabled="disableCheck" title="Inpatient">16 - 20
						<input type="checkbox" ng-model="ageRadioModel.five" uncheckable  ng-disabled="disableCheck" title="Inpatient">21 - 25
						<input type="checkbox" ng-model="ageRadioModel.six" uncheckable  ng-disabled="disableCheck" title="Inpatient">26 - Above -->
						<!-- <label ng-repeat="name in Ages" class="btn btn-primary" ng-model="ageRadioModel.Ages" ng-value="name.age_type" title={{name.title}}
						uib-btn-radio="name.age_type" ng-disabled="disableCheck">{{name.age_type}}</label> -->
					</div>
					<li><h4> <label title="{{Gender_Label}}"> Gender </label></h4></li>
					<div class="btn-group">
						<div ng-click="change()" ng-repeat="name in Gender">
							<h5><input type="radio" ng-model="genderModel.Gender" name={{name.name}} ng-value="name.gender_type" title={{name.title}}> {{name.gender_type}}</h5>
						</div>
					
					</div>
					<li><h4><label>Service Categories</label> </h4></li>
						<div class="btn-group" ng-click="change()">
							<h5>
							 <span  style="padding-top:15px; padding-bottom:15px; padding-left:5px"><input type="checkbox" ng-model="checkModel.IP" uncheckable  ng-disabled="disableCheck" title="Inpatient"> IP </span>
							 <span  style="padding-top:15px; padding-bottom:15px; padding-left:5px"><input type="checkbox" ng-model="checkModel.OP" uncheckable  ng-disabled="disableCheck" title="Outpatient"> OP </span>
							 <span  style="padding-top:15px; padding-bottom:15px; padding-left:5px"><input type="checkbox" ng-model="checkModel.NIPS" uncheckable  ng-disabled="disableCheck" title="Non-Institutional Provider Services (OutPatient or Third Party)"> NIPS </span>
							 <span  style="padding-top:15px; padding-bottom:15px; padding-left:5px"><input type="checkbox" ng-model="checkModel.ED" uncheckable  ng-disabled="disableCheck" title="Emergency Department"> ED </span>
							 <span  style="padding-top:15px; padding-bottom:15px; padding-left:5px"><input type="checkbox" ng-model="checkModel.MEDICARE" uncheckable  ng-disabled="disableCheck" title="Emergency Department"> MEDICARE </span>
							</h5>
							
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
							<h5>
								<input type="checkbox" ng-model="diseaseModel.Asthma" uncheckable> Asthma </span><br>
								<input type="checkbox" ng-model="diseaseModel.Diabetes" uncheckable> Diabetes </span> <br>
								<input type="checkbox" ng-model="diseaseModel.SCD" uncheckable> SCD </span> <br>
								<input type="checkbox" ng-model="diseaseModel.Epilepsy" uncheckable> Epilepsy </span> <br>
								<input type="checkbox" ng-model="diseaseModel.NewbornInjury" uncheckable> NewbornInjury </span> <br>
								<input type="checkbox" ng-model="diseaseModel.Prematurity" uncheckable> Prematurity </span> <br>
							</h5>
						</div>
					<li><h4> <label title="{{Map_Label}}">Map Controls </label></h4></li>

						<div class="btn-group" ng-click="change()">
							<div>
								<h5> <span  style="padding-top:15px; padding-bottom:3px; padding-left:5px"><input type="radio" ng-model="heatMapModel" value="Patient_Encounter" ng-disabled="disableCheck"> Patient_Encounter</li>
								<h5> <span  style="padding-top:15px; padding-bottom:3px; padding-left:5px"><input type="radio" ng-model="heatMapModel" value="Patient_Charges" ng-disabled="disableCheck"> Patient_Charges </li>
							</div>
						</div>
					<li><h4> <label>Number of Bins </label></h4></li>
					<label class="btn btn-default" ng-click="change()" title="Maximum 10 bins">Change Bin</label><input type="text" id="binSize" class="form-control" ng-model="binDivide">
						<br>
					<li><h4> <label title="Transparency">Transparency</label></h4></li>	
						<div ng-click="filterChange()" range-slider min="0" max="10" model-min="transparencyMin" model-max="transparencyMax" step="1" pin-handle="min" attach-handle-values="true" show-values="true"></div>
				</ul>
				
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
					<form method="get" action="../checkVizAngular/data/README.txt">
						<button type="submit">Download!</button>
					</form>
					<button type="submit" onclick="window.open('../checkVizAngular/data/readme.txt')">Download!</button>
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
      </div>
    </div>
    <?php
	}
	else
	  echo "Sorry !! Please register with us to see this content";
	?>
  </body>

</html>
