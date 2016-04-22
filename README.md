#Technical Specification

###app.js:

Initializing an AngularJS is done through the file app.js which resides in the scripts folder. Create the name of the app there. One can also add directives and controllers in this file itself. It is advised to have them separate to have a more modular application. 

A sample application initialization as given below: 
```
var leafletApp = angular.module('leafletApp', 
		['leaflet-directive','ngRoute','ui.bootstrap','services','trNgGrid','ngSanitize', 'ngCsv','ui-rangeSlider']);
```
###Views

There is only one view in our application which is an HTML page. The view is divided as follows : 
1.	Left Sidebar
This sidebar is used to display all the UI Controls. The UI controls are created using angularJS’s native directives such as ng-repeat on information coming from the config file. There are also custom filters and native filters on per need basis. 

In the below mentioned example : uiFilter is the custom filter
Headers in the information coming from configuration file. 
change is the method which can be used to access in the controller.

```
<li ng-repeat="name in Headers | uiFilter">
	<h4>
		<label title={{name.Header_Label}} > 
			{{name.Header_Name}}
		</label>
	</h4>
	<div class="btn-group" ng-click="change()" >
		<div class="genericdirective ng-scope" type="name.Header_Type">
		</div>
	</div>
</li>
```

2.	Right Sidebar
This side is hidden by default. One can use this side for anything like Legend etc. 
3.	Middle Section
This section contains the area where we will see information change happen. 
a.	GeoMap: 

This is a leaflet map being created and initialized from the logicController itself. This uses an angular and leaflet directive library which has been included with the code. 
b.	Data Grid: 

The data grid shows the data being filtered by any filters we include. The grid library being used is called TrNgGrid which has been included with the 
Sample filter to filter results. 

```
	if($scope.dataFilter){
		$scope.dataFilter = $scope.dataFilter.filter(function(item){
			if($scope.newSourceModel["Result"].toLowerCase() == item[20].toLowerCase())
			{
						return item;
					}
				});
	}

```
###Controllers: 
This is where the business logic will reside. A Controller is used to connect the model to the view. 
The default controller logic resides in /Scripts/controllers/LogicController.js

Changes from the UI element are currently mapped to change method which is where can start our logic to whatever changes we would like to make. The filter logic for each UI element and each data service can be put in there. 

###Configuration File: 

Creation of the UI Elements in this template is done through the configuration file. The headers come from the second object in the file. Following is the logic to create specific UI Elements : 
	1. Radio Button 
     
Using the radio button element we can create selection of elements which can be selected one at a time. We can define the name of each element and the tooltip under the label attribute. Header Label will be the tooltip of the complete block. 
Following is an example of the same. 
```
		{
			"Header_Name" : "Risk Tier", 
			"Header_ID" : 1,
			"Header_Type" : "radioButton",
			"Header_Info" : [
			{ "name" : "Low","label" : "Low Risk Tier for food inspection"},
			{ "name" : "Medium", "label"  : "Medium Risk Tier for food inspection"},
			{ "name" : "High", "label" : "High Risk Tier for food inspection"}
			],
			"Header_Label" : "Difference Data Sources to drive other options"
}
```

2. Check Box  

	Using the checkbox element, we can create a selection of elements in which we can select multiple elements at one time. We can define the name of each element and the tooltip for each element. One extra attribute to be given is a true/false flag which helps the developer to know which elements are selected. 
Following is an example for the same : 
```
	{
		"Header_Name" : "Categories", 
		"Header_ID" : 4,
		"Header_Type" : "checkBox",
		"Header_Info" : [
			{ "name" : "Bar" ,"label" : "InPatient Encounters","checked" : false},
			{ "name" : "Banquet" ,"label" : "OutPatient Encounters","checked" : false},
			{ "name" : "Cafeteria" ,"label" : "3rd Party","checked" : false},
			{ "name" : "Church" ,"label" : "Emergency Department Encounters","checked" : false},
			{ "name" : "DayCare" ,"label" : "Emergency Department Encounters","checked" : false},
			{ "name" : "Hospital" ,"label" : "Emergency Department Encounters","checked" : false},
			{ "name" : "Grocery" ,"label" : "Emergency Department Encounters","checked" : false}	
		],
		"Header_Label" : "Default Label "
	}
```
3. Slider 

Using slider, one can give a slider for numeric values and access the range defined by the slider. Name defines the name of the slider and Header_Min and Header_Max will help us define the values we would like to initialize the slider with. Value attribute will help the developer access the slider in the controller. 
Following is an example for the same. 
```
{
	"Header_Name" : "Header-9// slider",
	"Header_ID" : 8,
	"Header_Info" : [
		{ "name" : "slider1", "Header_Min" : 0, "Header_Max" : 50, "Value" : 0},
		{ "name" : "slider2", "Header_Min" : 0, "Header_Max" : 100, "Value" : 1},
		{ "name" : "slider3", "Header_Min" : 0, "Header_Max" : 150, "Value" : 2}
	] ,
	"Header_Type" : "slider"
}
```
4. Button 

One can create buttons to have click elements. This element can be a normal button and can be used to activate events.
Following is an example for the same : 
```
	{
		"Header_Name" : "Header-6// button",
		"Header_ID" : 5,
		"Header_Type" : "button",
		"Header_Info" : [
			{ "name" : "BtnX1" },
			{ "name" : "BtnX2" }
		]
	}
```
###Services

Services are created in AngularJS for data that needs to be shared between controllers and would typically not change. DB access or any file access can be made through a service. The service file for now is data_service.js. 
Following is an example of creating a method to get a json file using a service : 

```
food_inspection_json : function(callback){
										$http.get("../UI_Builder/data/foodinspection.json").success(function(data){
		callback(data);
	});
}
```

This can be accessed in the controller as follows : 
```
service_name.method_name(function(data){
	$scope.data = data;
});
```
