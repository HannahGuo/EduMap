// var config = {
//     apiKey: "AIzaSyBdGCZhuQPYhsQsLYhcfmrYK7ZG7pZs4fQ",
//     authDomain: "edumapbase.firebaseapp.com",
//     databaseURL: "https://edumapbase.firebaseio.com",
//     projectId: "edumapbase",
//     storageBucket: "edumapbase.appspot.com",
//     messagingSenderId: "763874557198",
//     appID: "1:763874557198:web:4fd77b99972e788c",
// };

// if (!firebase.apps.length) firebase.initializeApp(config);

// function logIn(){
//     var provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(provider).then(function(result) {
//         var token = result.credential.accessToken;
//         var user = result.user;
//         console.log(user);
//     }).catch(function(error) {
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         var email = error.email;
//         var credential = error.credential;
//         console.log(errorCode);
//     });
// }