var leafletApp = angular.module('leafletApp', ['leaflet-directive','controllers','ngRoute','ui.bootstrap','services','trNgGrid','ngSanitize', 'ngCsv','ui-rangeSlider']);

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

leafletApp.directive("radioButton", function(){
    return{
        restrict: "C",
        template: '<label ng-repeat="val in name.Header_Info" class="btn btn-primary" ng-model="newSourceModel[name.Header_Name]" ng-value="val.name" title={{val.label}} uib-btn-radio="val.name">{{val.name}}</label>'
    };
});

leafletApp.directive("checkBox", function(){
    return{
        restrict: "C",
        priority:2,
        template: '<label ng-repeat="val in name.Header_Info" class="btn btn-info" ng-model="newSourceModel" uib-btn-checkbox="val.name" title={{val.label}} uncheckable>{{val.name}}</label>'
    };
});

leafletApp.directive("slider", function(){
    return{
        restrict: "C",
        priority: 3,
        template: '<div range-slider min="0" max="30" model-min="transparencyMin" model-max="transparencyMax" step="1" pin-handle="min" attach-handle-values="true" show-values="true"></div>'
    };
});

leafletApp.directive("button", function(){
    return{
        restrict: "C",
        priority: 3,
        template: '<button ng-repeat="val in name.Header_Info" id="btn.{{val.name}}">{{val.name}}</button>'
    };
});

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
