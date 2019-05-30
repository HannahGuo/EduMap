var styleSheet = [{
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text",
    "stylers": [
      {
        "color": "#ffff00"
      },
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "stylers": [
      {
        "color": "#5047f3"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]
var markers = [];
var config = {
    apiKey: "AIzaSyBdGCZhuQPYhsQsLYhcfmrYK7ZG7pZs4fQ",
    authDomain: "edumapbase.firebaseapp.com",
    databaseURL: "https://edumapbase.firebaseio.com",
    projectId: "edumapbase",
    storageBucket: "edumapbase.appspot.com",
    messagingSenderId: "763874557198",
    appID: "1:763874557198:web:4fd77b99972e788c",
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

var database = firebase.database().ref("/studyGroups");

function init() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: createLatLng(43.5737479, -79.63055371),
        zoom: 9,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: 'passive',
        styles: styleSheet
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }

    var input = document.getElementById('search');
    var searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    database.on("value", function (snapshot) {
        dataRetrieved = snapshot.val();
        dataRetrieved.forEach(function(entry) {
            addMarker(createLatLng(entry.coordinates.lat, entry.coordinates.lng), map, createInfoWindowStr(entry.host, entry.name, entry.location, entry.time, entry.subject, entry.grade, entry.otherMessages));
        });
    }, function (error) {
        console.log("Error: " + error.code);
    });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        var bounds = new google.maps.LatLngBounds();

        if (places.length == 0) return;

        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }

            clearMarkers();
            markers.push(addMarker(place.geometry.location, map, "Location Requested: " + place.name));

            if (place.geometry.viewport) bounds.union(place.geometry.viewport);
            else bounds.extend(place.geometry.location);

        });
        map.fitBounds(bounds);
    });
}

function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
        markers.shift();
    }
}

function createLatLng(latitude, longitude) {
    return {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
    };
}

function addMarker(position, thisMap, infoWindowContent) {
    var marker = new google.maps.Marker({
        position: position,
        map: thisMap,
    });

    var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    marker.addListener("click", function () {
        infoWindow.open(map, marker);
    });
    console.log("I tried " + infoWindowContent);
    return marker;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function createInfoWindowStr(host, name, location, time, subject, grade, otherMessages){
  return "<h3>" + name + "</h3>" + " <b>Host: </b>"  + host + "<br><b>Address: </b>" + location + 
         "<br><b>Time: </b> " + time + " <br><b>Subject: </b>" + subject + "<br><b>Grade: </b>" + grade + "<br><b>Other Messages: </b>" + otherMessages + "<br><br><div class=\"join\">Join Group!</div>";
}