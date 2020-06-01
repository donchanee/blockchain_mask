const functions = require('firebase-functions');
const contract_api = require('./contract');
const etherscan_api = require('./etherscan');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors({origin: true}));

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

//contract.js
app.get('/maskMaking/:uid', contract_api.MaskMaking); //마스크 생산, json return (성공시 status : 'success', txUrl : '~~'(트랜잭션 조회 url))
app.get('/getMaskInfo/:tokenId', contract_api.getMaskInfo); //마스크 일련번호 내 datetime 가져오기
app.get('/dealMasks/:send_uid/:recv_uid/:token_id', contract_api.dealMasks); //마스크 토큰 전송 
app.get('/stockList/:uid', contract_api.getStockList); //판매사 재고토큰생성
app.get('/burnToken/:tokenId', contract_api.burnToken);

//etherscan.js
app.get('/normalTx/:address', etherscan_api.normalTx); //트랜잭션조회
app.get('/tokenInfo/:address', etherscan_api.getTokenInfofromWallet);//지갑주소의 토큰거래내역 조회
app.get('/getHistory/:uid', etherscan_api.getHistory); // 업체 재고, 입고, 판매, 경고 내역 조회
app.get('/getTokenHistory/:tokenId', etherscan_api.getTokenHistory); // 토큰 아이디 모든 거래내역 조회, 일반적으로 00=> 제조, 제조 => 유통, 유통=> 판매 

exports.maskSaver = functions.https.onRequest(app);