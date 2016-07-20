'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [function($scope) {
  //NgMap.getMap().then(function(map) {
    //console.log(map.getCenter());
    //console.log('markers', map.markers);
    //console.log('shapes', map.shapes);
  //});
var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(41.923, 12.513),
    mapTypeId: google.maps.MapTypeId.TERRAIN
}

var map = new google.maps.Map(document.getElementById('map'), mapOptions);
}]);

// var map;
//       function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: -34.397, lng: 150.644},
//           zoom: 8
//         });
//       }
//       //google.maps.event.addDomListener(window, "load", initialize);
