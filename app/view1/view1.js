'use strict';

var PointA;
var PointB;
var PointAName;
var PointBName;
var DirectObject;
var waypointToAdd;

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','$timeout','$http', function($scope,$timeout,$http) {

  //Init map
  var mapOptions = {
    zoom: 4,
    center: new google.maps.LatLng(41.923, 12.513),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // init directions service
  var dirService = new google.maps.DirectionsService();
  var dirRenderer = new google.maps.DirectionsRenderer({suppressMarkers: false});
  dirRenderer.setMap(map);

  //Search box init linked to pac-input text box
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  var input2 = document.getElementById('pac-input2');
  var searchBox2 = new google.maps.places.SearchBox(input2);
  var input3 = document.getElementById('pac-input3');
  var searchBox3 = new google.maps.places.SearchBox(input3);

  //Search box gets displays results biased towards search value
  map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
          searchBox2.setBounds(map.getBounds());
          searchBox3.setBounds(map.getBounds());
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

    var addressCompsA;

    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        //path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      /*markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));*/

      if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        addressCompsA = place.formatted_address;

      });
    map.fitBounds(bounds);

    //console.log(markers[0].position.lat() +" "+ markers[0].position.lng());

    //PointA = new google.maps.LatLng(markers[0].position.lat(), markers[0].position.lng());
    PointA = addressCompsA;
    //PointAName = markers[0].title;

    /*if (typeof PointB !== 'undefined') {
      // the variable is defined
      RenderRoute();
    }*/

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

    var addressCompsB;

    places2.forEach(function(place) {
      var icon2 = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      /*markers2.push(new google.maps.Marker({
        map: map,
        icon: icon2,
        title: place.name,
        position: place.geometry.location
      }));*/

      if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds2.union(place.geometry.viewport);
        } else {
          bounds2.extend(place.geometry.location);
        }

      addressCompsB = place.formatted_address;

      });
    map.fitBounds(bounds2);

    //console.log(markers[0].position.lat() +" "+ markers[0].position.lng());

    //PointB = new google.maps.LatLng(markers2[0].position.lat(), markers2[0].position.lng());
    PointB = addressCompsB;
    //PointBName = markers2[0].title;
    //renderRoute();
    /*if (typeof PointA !== 'undefined') {
      // the variable is defined
      RenderRoute();
    }*/

  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Waypoint Additions

  //SearchBox 3: Waypoints
  //Places details of search query selection in places var
  searchBox3.addListener('places_changed', function() {
    var places3 = searchBox3.getPlaces();

    if (places3.length == 0) {
          return;
    }

    places3.forEach(function(place) {
          waypointToAdd = place.formatted_address;
    });

  });

var waypoints = [];
$scope.waypointsDisplay = [];

  $scope.addWaypoint = function() {
    console.log("waypoint in");
    $scope.waypointsDisplay.push({
      waypointToAdd,
    });
    waypoints.push({
      location: waypointToAdd,
      stopover: true
    });
  }


  $scope.startMapping = function() {
    renderRoute();
  }

  //$scope.request;
  //$scope.renderRoute = function() {
  function renderRoute() {
    console.log("Route rendered");
    //console.log(PointA);
    //console.log(PointB);

    var request = {
      //origin: markers[0].position.lat()+","+markers[0].position.lng(),
      origin: PointA,
      destination: PointB,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    };

    dirService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        dirRenderer.setDirections(result);
        //DirectObject = dirRenderer.getDirections();
        // dirRenderer.setOptions({
        //     directions: DirectObject
        // });

        //var str = JSON.stringify(DirectObject, null, 2); // spacing level = 2
        //angular.element(routeInfo).html(str);
      }
      else {
        console.log("request object may not be correctly init");
        console.log(status);
      }
    });

  }

  $scope.pointsToReachA = [];
  $scope.pointsToReachB = [];
  $scope.pointsToReachDirect = [];
  $scope.subRoutes = [];

  $scope.add = function(pointToAdd) {
    console.log("NOT EVER SEE THIS");
    //var index = $scope.pointsToAdd.indexOf(pointToAdd);

    //$scope.pointsToAdd.splice(index, 1);

    /*if($scope.pointsToReach.length == 0) {
      $scope.pointsToReach.push(angular.copy(PointA))
    }*/
    /*$timeout(function() {
      $scope.pointsToReach.push("yo")
    }, 1000);*/
    //$scope.pointsToReachA.push(PointAName);
    //$scope.pointsToReachB.push(PointBName);
    //$scope.pointsToReachDirect.push(DirectObject);


    //If subRoutes array already contains either origin or destination
    //then do not add to array and throw error

    var subRoute = {
        origin: PointAName,
        destination: PointBName,
        directions: DirectObject
    }

    $scope.subRoutes.push(subRoute);

    //console.log($scope.pointsToReachA[0]);
    console.log(subRoute);
  }

  $scope.remove = function() {
    $scope.waypointsDisplay.pop();
    waypoints.pop();
  }

  $scope.testing = "change soon";
  $scope.restfulAPI = function() {
    var root = 'http://jsonplaceholder.typicode.com';
    $http({
        method : "GET",
        url: root + "/posts/1"
    }).then(function mySucces(response) {
        $scope.testing = response.data;
    }, function myError(response) {
        $scope.testing = response.statusText;
    });
  }

}]);
