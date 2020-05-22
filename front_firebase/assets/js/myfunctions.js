
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
    alert('실패');
  } else {
    alert('성공');
  }
}

function sortByDate(data) {
  data.sort((a,b) =>  {

    return b.time - a.time;

  });
}
//계좌와 업체이름 매핑 시켜주는 함수
function addrToName(){

}