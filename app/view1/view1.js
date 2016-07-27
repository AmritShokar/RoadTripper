'use strict';

var PointA;
var PointB;

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {

  //Init map
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(41.923, 12.513),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // init directions service
  var dirService = new google.maps.DirectionsService();
  var dirRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
  dirRenderer.setMap(map);

  //Search box init linked to pac-input text box
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  var input2 = document.getElementById('pac-input2');
  var searchBox2 = new google.maps.places.SearchBox(input2);

  //Search box gets displays results biased towards search value
  map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
          searchBox2.setBounds(map.getBounds());
  });

  //SearchBox 1: Point A
  var markers = [];
  //Places details of search query selection in places var
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
          return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    //For each place, get the icon, name, location
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }



      });
    map.fitBounds(bounds);

    //console.log(markers[0].position.lat() +" "+ markers[0].position.lng());

    PointA = new google.maps.LatLng(markers[0].position.lat(), markers[0].position.lng());

    if (typeof PointB !== 'undefined') {
      // the variable is defined
      RenderRoute();
    }

  });


//////////////////////////////////////////////////////////////////////////////////////////////////////////


  //SearchBox 2: Point B
  var markers2 = [];
  //Places details of search query selection in places var
  searchBox2.addListener('places_changed', function() {
    var places2 = searchBox2.getPlaces();

    if (places2.length == 0) {
          return;
    }

    // Clear out the old markers.
    markers2.forEach(function(marker) {
      marker.setMap(null);
    });
    markers2 = [];

    //For each place, get the icon, name, location
    var bounds2 = new google.maps.LatLngBounds();

    places2.forEach(function(place) {
      var icon2 = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers2.push(new google.maps.Marker({
        map: map,
        icon: icon2,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds2.union(place.geometry.viewport);
        } else {
          bounds2.extend(place.geometry.location);
        }



      });
    map.fitBounds(bounds2);

    //console.log(markers[0].position.lat() +" "+ markers[0].position.lng());

    PointB = new google.maps.LatLng(markers2[0].position.lat(), markers2[0].position.lng());

    if (typeof PointA !== 'undefined') {
      // the variable is defined
      RenderRoute();
    }

  });

  function RenderRoute() {

    var request = {
      //origin: markers[0].position.lat()+","+markers[0].position.lng(),
      origin: PointA,
      destination: PointB,
      //waypoints: [{location:"48.12449,11.5536"}, {location:"48.12515,11.5569"}],
      travelMode: google.maps.TravelMode.DRIVING
    };

    dirService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        dirRenderer.setDirections(result);
      }
      else {
        //console.log("request object may not be correctly init");
        //console.log(status);
      }
    });

  }

  $scope.pointsToReach = [];

  $scope.add = function(pointToAdd) {

    //var index = $scope.pointsToAdd.indexOf(pointToAdd);

    //$scope.pointsToAdd.splice(index, 1);

    /*if($scope.pointsToReach.length == 0) {
      $scope.pointsToReach.push(angular.copy(PointA))
    }*/
    $scope.pointsToReach.push(angular.copy(pointToAdd))

    console.log($scope.pointsToReach[0]);
  }

}]);
