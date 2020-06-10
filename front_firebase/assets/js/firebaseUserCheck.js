var db = firebase.firestore();
let userAddr = "";
let userName = "";
let userEmail = "";
let userIndex = "";
var firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
var firebaseDatabase; //파이어베이스 db 모듈 전역변수
var userInfo; //가입한 유저의 정보. object 타입


firebaseEmailAuth = firebase.auth(); //파이어베이스 인증 객체
firebaseDatabase = firebase.database(); //파이어베이스 데이터베이스 객체


//유저가 로그인 했는지 안했는지 확인해주는 함수
function userSessionCheck() {

  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {

    if (user) {
      //로그인 성공한 유저 id 확인해 보기 - firebase database에 접근해서 데이터 조회 하는 함수
      var docRef = db.collection("users").doc(firebaseEmailAuth.currentUser.uid);

      docRef.get().then(function (doc) {
        if (doc.exists) {
          userAddr = doc.data().addr;
          userName = doc.data().name;
          userEmail = user.email;
          userIndex = doc.data().index;
          document.getElementById("id").textContent = user.email + " 님이 로그인했습니다." + " 계좌 : " + userAddr + " 이름 :" + userName;
          //alert(doc.data().addr+" 입니다.");

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });

      return true;
    }
  });
}