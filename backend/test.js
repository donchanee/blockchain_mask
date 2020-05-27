
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

const fb = require('firebase');

fb.initializeApp(firebaseConfig);

let db = fb.firestore();
let list = [1,2,3,4,5];
let chk=0;
let dbRef = db.collection("users").doc("lof5P4jV8IMm1fNUoTDcRKpsuvq1").collection("inventory")
dbRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      for(idx in list){
        if(list[idx] == doc.id) chk++;
        if(chk == 0){
          dbRef.doc(String(list[idx])).set({count: 500}, {merge: true});
        }
      }
    });
  }).catch(err=>{
    console.log(err);
  })