const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const etherscan = require('./etherscan');
const contract = require('./contract');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
/*
성공
status: "Success",
txUrl: 트랜잭션주소

실패
status: "Fail",
errMSg: 함수별 에러메세지
errDetail: 리턴받은 에러메세지

stocklist
status: "Success"
stock: 보유토큰배열
*/

//contract_test.js
app.get('/maskMaking/:uid', contract.MaskMaking); //마스크 생산, json return (성공시 status : 'success', txUrl : '~~'(트랜잭션 조회 url))
app.get('/getMaskInfo/:tokenId', contract.getMaskInfo); //마스크 일련번호 내 datetime 가져오기
app.get('/dealMasks/:send_uid/:recv_uid/:token_id', contract.dealMasks); //마스크 토큰 전송 
app.get('/stockList/:uid', contract.getStockList); //재고확인, 

//etherscan.js
app.get('/normalTx/:address', etherscan.normalTx); //트랜잭션조회
app.get('/tokenInfo/:address', etherscan.getTokenInfofromWallet);//지갑주소의 토큰거래내역 조회
app.get('/getHistory/:uid', etherscan.getHistory); // 제조사 생성내역, 거래내역조회, json return
app.get('/getTokenHistory/:tokenId', etherscan.getTokenHistory);
//app.get('/getTxHistory/:address', etherscan.getTxHistory);


/*
================= deprecated ==================
app.get('/checkwallet/:address', etherscan.checkwallet)
app.get('/internalTx:address', etherscan.internalTx)
*/


const server = app.listen(8000, function(){
    console.log('load Success!');
});