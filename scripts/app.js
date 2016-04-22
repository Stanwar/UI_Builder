var leafletApp = angular.module('leafletApp', ['leaflet-directive','ngRoute','ui.bootstrap','services','trNgGrid','ngSanitize', 'ngCsv','ui-rangeSlider']);

/*
    Compiling elements. 
*/
leafletApp.directive("genericdirective", function($compile) {
  return {
    restrict: "C",
    template: "<div></div>",
    replace : true,
    link: function(scope, element,attr){
        element.append("<div class="+ scope.name.Header_Type+"></div>");
        $compile(element.contents())(scope); 
	}
  };
});

/*
    Creating a directive to create radiobuttons.
*/
leafletApp.directive("radioButton", function(){
    return{
        restrict: "C",
         template: '<label ng-repeat="val in name.Header_Info" class="btn btn-primary" ng-model="newSourceModel[name.Header_Name]" ng-value="val.name" title={{val.label}} uib-btn-radio="val.name">{{val.name}}</label>'
        // template : '<input type="radio" ng-repeat="val in name.Header_Info" class="btn btn-primary" ng-model="newSourceModel[name.Header_Name]" ng-value="val.name" title={{val.label}} name={{val.name}}>{{val.name}}x`'
    };
});

/*
    Creating a directive to create checkboxes
*/
leafletApp.directive("checkBox", function(){
    return{
        restrict: "C",
        priority:2,
        template: '<label ng-repeat="val in name.Header_Info" class="btn btn-info" ng-model="newCheckModel.name.Header_Name[val.name]" uib-btn-checkbox="val.name" title={{val.label}} uncheckable>{{val.name}}</label>'
    };
});
/*
    Creating a directive to create a custom slider
*/
leafletApp.directive("slider", function(){
    return{
        restrict: "C",
        priority: 3,
        template: '<div range-slider ng-click="change()" ng-repeat="val in name.Header_Info" min="val.Header_Min" max="val.Header_Max" model-min="transparencyMin[val.Value]" model-max="transparencyMax[val.Value]" step="5" pin-handle="min" attach-handle-values="true" show-values="true"></div>'
    };
});

/*
    Creating a directive to create a custom button
*/
leafletApp.directive("button", function(){
    return{
        restrict: "C",
        priority: 3,
        template: '<button ng-repeat="val in name.Header_Info" id="btn.{{val.name}}">{{val.name}}</button>'
    };
});

/*
    Custom AngularJS Filter 
*/
leafletApp.filter('uiFilter', function() {
  return function(input) {
	    var filtered = [];
	    for (var i = 0; i < input.length; i++) {
			var item = input[i];
			if (item.Header_Type === 'checkBox') {
				filtered.push(item);
			}
			if (item.Header_Type === 'radioButton') {
				filtered.push(item);
			}
			if (item.Header_Type === 'button'){
				filtered.push(item);
			}
			if (item.Header_Type === 'slider'){
				continue;
			}
	    }
	    return filtered;
  };
});
