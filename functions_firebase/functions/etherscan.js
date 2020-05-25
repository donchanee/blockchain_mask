//mask Management

const request = require('request');
const util = require('util');
const functions = require('firebase-functions');

const myApi = 'DI2QYXMJ7U1UY4G8AAE175TC33B3V3SGSE';
const contractaddress = "0x2727b026EdB116B20196a1abF32e0cA8311E93e2";

exports.normalTx = functions.https.onRequest((req, res) => {
    let url = util.format('http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=%s&startblock=0&endblock=99999999&sort=asc&apikey=%s', req.params.address, myApi);
    console.log('start normalTx');
    request(url, (err, response, body)=>{
        if(!err && response.statusCode === 200){
            let data = {
                status: "Success",
                txDetail: body
            };
            res.send(JSON.stringify(data));
        }else{
            let data = {
                status: "Fail",
                errMsg: "Fail to inparams tx",
                errDetail: body
            };
            res.send(JSON.stringify(data));
        }
    });
});

exports.getTokenInfofromWallet = functions.https.onRequest((req, res) => {
    let url = util.format('https://api-ropsten.etherscan.io/api?module=account&action=tokennfttx&contractaddress=%s&address=%s&page=1&offset=100&sort=asc&apikey=%s', contractaddress, req.params.address, myApi);
    request(url, (err, response, body)=>{
        let data = new Object();
        if(!err && response.statusCode === 200){
            data = {
                status: "Success",
                txDetails: JSON.parse(body)
            }
        }else{
            data = {
                status: "Fail",
                errMsg: "Fail to inparams tx",
                errDetail: JSON.parse(body)
            }
        }
        res.send(JSON.stringify(data));
    });
});

exports.getHistory = functions.https.onRequest((req, res) => { //제조사 생성내역, 거래내역 조회
    let url = util.format('https://api-ropsten.etherscan.io/api?module=account&action=tokennfttx&contractaddress=%s&address=%s&page=1&offset=100&sort=asc&apikey=%s', contractaddress, req.params.address, myApi);
    let data = new Object();
    request(url, (err, response, body) =>{
        if(!err && response.statusCode === 200){
            let json = JSON.parse(body);
            let result = json['result'];

            let entered = new Array();
            let released = new Array();
            let stock = new Array();

            for(tmp in result){
                //console.log('now : ' + tmp + ', ' + result[tmp]['to']);
                let txInfo = {
                    time: result[tmp]['timeStamp'],
                    tokenId: result[tmp]['tokenID'],
                    num: '1',
                    from: result[tmp]['from'],
                    to: result[tmp]['to']
                }
                if(result[tmp]['to'] === req.params.address.toLowerCase()){ //생성내역, 지금은 거래완료한 토큰도 보이는방식, 거래한토큰은 거르는식으로 구현해야함.
                    entered.push(txInfo);
                }else{ //거래내역
                    released.push(txInfo);
                }
            }

            if(!released || !entered){ // 입고, 출고내역이 없을 수도 있음
                stock = entered;
                data = {
                    status: "Success",
                    enteredHistory: entered,
                    releasedHistory: released,
                    stockList: stock
                }
            }else{
                for(e_idx in entered){
                    let token = entered[e_idx].tokenId;
                    let chk = 0;
                    for(r_idx in released){
                        if(token === released[r_idx].tokenId) chk++;
                    }
                    if(chk === 0) stock.push(entered[e_idx]);
                }
                
                data = {
                    status: "Success",
                    enteredHistory: entered,
                    releasedHistory: released,
                    stockList: stock
                }

            }

        }else{
            data = {
                status: "Fail",
                errMsg: "Fail to access API",
                errDetail: err
            }
        }
        res.send(JSON.stringify(data));
    });
});

/*
#deprecated
exports.checkwallet = function(req, res){
    //Get a list of 'Normal' Transactions By Address
    let url = util.format('http://api-ropsten.etherscan.io/api?module=account&action=txlistinternal&address=%s&startblock=2700000&endblock=2702578&sort=asc&apikey=%s', req.params.address, myApi);
    console.log(url);
    request(url, function(err, response, body){
        if(!err && response.statusCode == 200){
            //console.log(body);
            res.send('good' + body);
        }else{
            //console.log(body);
            res.send('err' + body);
        }
    });
};

exports.internalTx = function(req, res){//지금작동안함싸발
    let url = util.format('http://api-ropsten.etherscan.io/api?module=account&action=txlistinternal&address=%s&startblock=0&endblock=2702578&sort=asc&apikey=%s', req.params.address, myApi);
    console.log('start internalTx');
    request(url, function(err, response, body){
        if(!err && response.statusCode == 200){
            res.send('good' + body);
        }else{
            res.send('err' + body);
        };
    });
};
*/