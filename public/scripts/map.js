var styleSheet = [{
    "elementType": "geometry",
    "stylers": [{
      "color": "#1d2c4d"
    }]
  },
  {
    "elementType": "labels.text",
    "stylers": [{
      "color": "#ffff00"
    }, ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#8ec3b9"
    }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#1a3646"
    }]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [{
      "color": "#4b6878"
    }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#64779e"
    }]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [{
      "color": "#4b6878"
    }]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [{
      "color": "#334e87"
    }]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [{
      "color": "#023e58"
    }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{
      "color": "#283d6a"
    }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#6f9ba5"
    }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#1d2c4d"
    }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#023e58"
    }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#3C7680"
    }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{
      "color": "#304a7d"
    }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#98a5be"
    }]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#1d2c4d"
    }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{
      "color": "#2c6675"
    }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [{
      "color": "#255763"
    }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#b0d5ce"
    }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#023e58"
    }]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#98a5be"
    }]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [{
      "color": "#1d2c4d"
    }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [{
      "color": "#283d6a"
    }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{
      "color": "#3a4762"
    }]
  },
  {
    "featureType": "water",
    "stylers": [{
      "color": "#5047f3"
    }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{
      "color": "#0e1626"
    }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#4e6d70"
    }]
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

if (!firebase.apps.length) firebase.initializeApp(config);

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

  var input = document.getElementById('search');
  var searchBox = new google.maps.places.SearchBox(input);

  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  $("#userZoom").click(function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        map.setCenter(createLatLng(position.coords.latitude, position.coords.longitude));
      }, function () {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  database.on("value", function (snapshot) {
    dataRetrieved = snapshot.val();
    dataRetrieved.forEach(function (entry, i) {
      addMarker(createLatLng(entry.coordinates.lat, entry.coordinates.lng), map, createInfoWindowStr(entry.host, entry.name, entry.location, entry.date, entry.time, entry.subject, entry.grade, entry.otherMessages, i));
    });
    console.log("Database reached!")
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

  return marker;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

function createInfoWindowStr(host, name, location, date, time, subject, grade, otherMessages, i) {
  return "<h3>" + name + "</h3>" + " <b>Host: </b>" + host + "<br><b>Address: </b>" + location +
    "<br><b>Date: </b>" + date + "<br><b>Time: </b> " + time + " <br><b>Subject: </b>" + subject + "<br><b>Grade: </b>" + grade +
    "<br><b>Other Messages: </b>" + otherMessages +
    "<br><br><button onclick='runMe(\"" + name + "\"," + i + ")' class=\"join\">Join Group!</button>";
}

function runMe(thisName, thisId) {
  document.getElementById("myForm").elements["edugroup"].value = thisName;
  document.getElementById("myForm").elements["edugroupID"].value = thisId;
}

function sendData() {
  // Random ID Generator courtesy of https://gist.github.com/gordonbrander/2230317
  var randomID = Math.random().toString(36).substr(2, 9);

  var groupID = document.getElementById("myForm").elements["edugroupID"].value;

  firebase.database().ref("studyGroups/" + groupID + "/attendees/" + randomID).update({
    name: document.getElementById("myForm").elements["name"].value,
    school: document.getElementById("myForm").elements["school"].value,
    grade: document.getElementById("myForm").elements["grade"].value,
    email: document.getElementById("myForm").elements["email"].value,
    notes: document.getElementById("myForm").elements["notes"].value
  });

  console.log("Added User to EduGroup!");
}

$(document).ready(function () {
  $(document).on('submit', '#myForm', function () {
    console.log("User added to EduGroup!");
    sendData();
    showSnackBar();
    sendEmail();
    clearFormData();
    return false;
  });
});

// Thanks to https://www.smtpjs.com/ and https://elasticemail.com/ for e-mail sending code
function sendEmail() {
  Email.send({
    Host: "smtp.elasticemail.com",
    Username: "658515@pdsb.net",
    Password: "47e3e806-63b2-4911-b621-912225183c3b",
    To: document.getElementById("myForm").elements["email"].value,
    From: "658515@pdsb.net",
    Subject: "You have successfully joined an EduGroup!",
    Body: "Don't forget! The name of your EduGroup is " + document.getElementById("myForm").elements["edugroup"].value + ".",
  }).then(
    message => console.log(message)
  );
}

// Snackbar code thanks to https://www.w3schools.com/howto/howto_js_snackbar.asp
function showSnackBar() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

function clearFormData() {
  document.getElementById("myForm").elements["name"].value = "";
  document.getElementById("myForm").elements["school"].value = "";
  document.getElementById("myForm").elements["grade"].value = "";
  document.getElementById("myForm").elements["email"].value = "";
  document.getElementById("myForm").elements["notes"].value = "";
  document.getElementById("myForm").elements["edugroup"].value = "";
  document.getElementById("myForm").elements["edugroupID"].value = "";
}