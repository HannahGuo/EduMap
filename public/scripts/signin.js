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
var provider = new firebase.auth.GoogleAuthProvider();

function logIn() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        console.log("Signed in!");
    }).catch(function (error) {
        console.log("Could not sign in " + error.code);
    });
}

function logOut() {
    firebase.auth().signOut().then(function () {
        console.log("Signed out!");
    }).catch(function (error) {
        console.log("Could not sign out " + error.code);
    });
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById("currentSignIn").innerHTML = "You are signed in as " + " <span id=\"thisName\">" + user.displayName + " </span> with the e-mail <span id='thisEmail'>" + user.email + "<span>";
        document.getElementById("currentSignIn").style.color = "green";
        document.getElementById("fillMeWhenSignIn").style.display = "block";

        var searchBox = new google.maps.places.SearchBox(document.getElementById('location'));

        database.on("value", function (snapshot) {
            console.log("Database reached!")
            dataRetrieved = snapshot.val();
            dataRetrieved.forEach(function (entry, i) {
                if ((entry.email == user.email) && dataRetrieved.length > document.getElementById("showEduGroups").rows.length) {
                    var row = document.getElementById("showEduGroups").insertRow(-1);

                    var cell0 = row.insertCell(0);
                    cell0.innerHTML = entry.host;

                    var cell1 = row.insertCell(1);
                    cell1.innerHTML = entry.email;

                    var cell2 = row.insertCell(2);
                    cell2.innerHTML = entry.date;

                    var cell3 = row.insertCell(3);
                    cell3.innerHTML = entry.time;

                    var cell4 = row.insertCell(4);
                    cell4.innerHTML = entry.name;

                    var cell5 = row.insertCell(5);
                    cell5.innerHTML = Object.keys(entry.attendees).length + " out of " + entry.capacity;

                    var cell6 = row.insertCell(6);
                    cell6.innerHTML = entry.location;

                    var cell7 = row.insertCell(7);
                    cell7.innerHTML = entry.subject;

                    var cell8 = row.insertCell(8);
                    cell8.innerHTML = entry.grade;

                    var cell9 = row.insertCell(9);
                    cell9.innerHTML = organizeAttendees(entry.attendees);

                    var cell10 = row.insertCell(10);
                    cell10.innerHTML = "<span onclick=\"deleteMe(" + i + ")\"> X <span>";
                    cell10.className = "removeGroup";
                    cell10.id = "r" + i;
                }
            });

            $(document).ready(function () {
                $(document).on('submit', '#myForm2', function () {
                    $.get(genUrl(document.getElementById("myForm2").elements["location"].value), function (data, status) {
                        sendData(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
                    });
                    alert("You created an EduGroup!");
                });
            });

            function findValidID() {
                for (var i = 0; i < dataRetrieved.length; i++) {
                    if (!(i in dataRetrieved))
                        return i;
                }
                return dataRetrieved.length;
            }

            function sendData(lat, lng) {
                firebase.database().ref("studyGroups/" + (findValidID()) + "/").set({
                    host: user.displayName,
                    email: user.email,
                    name: document.getElementById("myForm2").elements["name"].value,
                    location: document.getElementById("myForm2").elements["location"].value,
                    subject: document.getElementById("myForm2").elements["subject"].value,
                    date: document.getElementById("myForm2").elements["date"].value,
                    time: document.getElementById("myForm2").elements["time"].value,
                    capacity: document.getElementById("myForm2").elements["capacity"].value,
                    grade: document.getElementById("myForm2").elements["grade"].value,
                    otherMessages: document.getElementById("myForm2").elements["otherMessages"].value,
                    attendees: {
                        host: {
                            email: user.email,
                            grade: document.getElementById("myForm2").elements["grade"].value,
                            name: user.displayName,
                            notes: "",
                            school: "your school"
                        },
                    },
                    coordinates: {
                        "lat": lat,
                        "lng": lng
                    },
                });
            }

        }, function (error) {
            console.log("Error: " + error.code);
        });

    } else {
        document.getElementById("fillMeWhenSignIn").style.display = "none";
        document.getElementById("currentSignIn").innerHTML = "You are currently not signed in!";
        document.getElementById("currentSignIn").style.color = "red";
        while (document.getElementById("showEduGroups").rows.length > 1)
            document.getElementById("showEduGroups").deleteRow(-1);
    }
});

function organizeAttendees(attendees) {
    var getValues = Object.values(attendees);
    var listAttendees = [];

    for (var i = 0; i < getValues.length; i++) {
        listAttendees.push(" <li> " + getValues[i].name + " from " + getValues[i].school + " in grade " +
            getValues[i].grade + " with the e-mail " + getValues[i].email + " Included notes: " +
            getValues[i].notes + " <br><br>");
    }

    return listAttendees;
}

function genUrl(location) {
    return "https://maps.googleapis.com/maps/api/geocode/json?address=" + location.split(' ').join('+') + "&key=AIzaSyANow_dOABv6DsG0qdgPCcUYx6uyuULBgE";
}

function deleteMe(id) {
    firebase.database().ref("studyGroups/" + id + "/").remove();
    location.reload();
}