
//주민번호 뒷자리 xxxxx로 바꿔주는 함수
function civilNumberEncode(num){
  //8번부터 13번까지 변경
  var tmp = num;
  return tmp.substr(0, 8) + "xxxxxx";
}

//주민번호 유효성 검사
function ValidateCivilNumber(civilNumber){
  if(civilNumber.charAt(6) != "-"){
    return false;
  }
  else if(civilNumber.length != 14){
    return false;
  }
  return true;
}
function IsSuccessOrFail(data) {
  if (data.status === "Fail") {
    if(data.errMsg === "Error to transaction sending"){
      alert('이전 트랜잭션이 pending중입니다. 잠시후 다시 시도해주세요');
      return false;
    }
    else if(data.errMsg === "Check your token in stock"){
        alert('재고에 없는 일련번호입니다. 확인후 다시 시도해주세요');
        return false;
    }
    else{
    alert('실패');
    return false;
  }
  } else if(data.status === "Success"){
    alert('성공! 결과는 수분 내로 확인이 가능합니다.');
    return true;
  }

}
function getTokenIdFromStock(data){
  var tmpArray = new Array();
  for(i =0; i< data.stockList.length;i++){
    tmpArray.push(data.stockList[i].tokenId);
  }
  console.log(tmpArray);
  return tmpArray;
}

function sortByDate(data) {
  data.sort((a,b) =>  {

    return b.time - a.time;

  });
}
function getWarningList(uid) {
  console.log(uid);
  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET',
      'https://us-central1-maskproject-6e385.cloudfunctions.net/maskSaver/getHistory/' + uid);//여기 warning리스트 받아오는 주소 필요
  ourRequest.onload = function () {
    //console.log(ourRequest.responseText);
    var ourData = JSON.parse(ourRequest.responseText);
    //console.log(ourData);
    var htmlString = "";
    for(i=0;i<ourData.warning.length;i++){
      htmlString += "<tr><td>" + ourData.warning[i].tokenId + "</td>";
      htmlString += "<td>" + new Date(ourData.warning[i].enteredTime * 1000).toLocaleString() + "</td>";
      htmlString += "<td>" + stampTotime(ourData.warning[i].passedTime) + "</td></tr>";
    }
    $("#warning_cardbody").append(htmlString);
  };
  ourRequest.send();
}

function stampTotime(time){
  var day = Math.floor(time / 86400);
  var hours = Math.floor((time - day*86400)/3600);
  var minutes = Math.floor((time - day*86400 - hours*3600)/60);
  
  return day + " 일 " + hours + " 시간 " + minutes + " 분 ";
}

function userSessionCheck() {

  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {

    if (user) {
      //로그인 성공한 유저 id 확인해 보기 - firebase database에 접근해서 데이터 조회 하는 함수
      var docRef = db.collection("users").doc(firebaseEmailAuth.currentUser.uid);

    docRef.get().then(function(doc) {
        if (doc.exists) {
          var userAddr= doc.data().addr;
          var userName = doc.data().name;
          var userEmail = user.email;
          var userIndex = doc.data().index;
          return userName + "님 환영합니다."+ "<br> 계좌 : "+userAddr;
          //alert(doc.data().addr+" 입니다.");

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });



        //자바스크립트 dom 선택자를 통해서 네비게이션 메뉴의 엘리먼트 변경해주기


        //alert(userInfo.userid);  //uid는 db에서 user 테이블의 각 개체들의 pk 인데, 이 값은 인증에서 생성된 아이디의 pk 값과 같다. *중요!

        return true;
      }
    });
}
/*
function doWarningList(data){
  var result = "";
  for(i=0;i<data.warning.length;i++){
      result+= "일련번호 : "+ data.warning[i].tokenId, +" 입고시간 : "+data.warning[i].enteredTime+" 경과시간 : "+data.warning[i].passedTime+"\n"                   
   };
 $('#notification_cardbody').append(result);
}
*/
// function alertTakeTimes(){
//   alert('결과는 수분 내로 확인이 가능합니다. ');
// }
//계좌와 업체이름 매핑 시켜주는 함수
