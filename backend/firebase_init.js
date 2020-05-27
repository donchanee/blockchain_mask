
const firebase = require('firebase');
var firebaseConfig = {
    apiKey: "AIzaSyBUFarAIUCHFdR-pIrYGaTNJC43CpFBZZA",
    authDomain: "maskproject-6e385.firebaseapp.com",
    databaseURL: "https://maskproject-6e385.firebaseio.com",
    projectId: "maskproject-6e385",
    storageBucket: "maskproject-6e385.appspot.com",
    messagingSenderId: "759315784284",
    appId: "1:759315784284:web:f7c963bac46cd7798cbc99",
    measurementId: "G-B4436TDC82"
  };

module.exports =  !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();