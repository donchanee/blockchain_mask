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
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

    var firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
  var firebaseDatabase; //파이어베이스 db 모듈 전역변수
  var userInfo; //가입한 유저의 정보. object 타입


  firebaseEmailAuth = firebase.auth(); //파이어베이스 인증 객체
  firebaseDatabase = firebase.database(); //파이어베이스 데이터베이스 객체
