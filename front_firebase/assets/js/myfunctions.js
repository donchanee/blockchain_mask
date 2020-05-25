
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
function getWarningList() {
  var ourRequest = new XMLHttpRequest();
  ourRequest.open('GET',
      'https://us-central1-maskproject-6e385.cloudfunctions.net/maskSaver/getHistory/' +
      userAddr);//여기 warning리스트 받아오는 주소 필요
  ourRequest.onload = function () {
      var ourData = JSON.parse(ourRequest.responseText);
      console.log(ourData);
      doWarningList(ourData);
  };
  ourRequest.send();
}
function doWarningList(data){
  var result = "";
  for(i=0;i<data.warning.length;i++){
      result+= "일련번호 : "+ data.warning[i].tokenId, +" 입고시간 : "+data.warning[i].enteredTime+" 경과시간 : "+data.warning[i].passedTime+"\n"                   
   };
 $('#notification_cardbody').append(result);
}
// function alertTakeTimes(){
//   alert('결과는 수분 내로 확인이 가능합니다. ');
// }
//계좌와 업체이름 매핑 시켜주는 함수
function addrToName(){

}