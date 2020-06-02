//mask Management

const request = require('request');
const util = require('util');
const fb = require("./firebase_init");

const myApi = 'DI2QYXMJ7U1UY4G8AAE175TC33B3V3SGSE';
const contractaddress = "0x2727b026EdB116B20196a1abF32e0cA8311E93e2";

let db = fb.firestore();

exports.normalTx = ((req, res)=>{
    let url = util.format('http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=%s&startblock=0&endblock=99999999&sort=asc&apikey=%s', req.params.address, myApi);
    console.log('start normalTx');
    request(url, function(err, response, body){
        if(!err && response.statusCode === 200){
            let data = {
                status: "Success",
                txDetail: body
            };
            res.send(JSON.stringify(data));
        }else{
            let data = {
                status: "Fail",
                errMsg: "Fail to inquery tx",
                errDetail: body
            }
            res.send(JSON.stringify(data));
        }
    });
});

exports.getTokenInfofromWallet = ((req, res)=>{
    let url = util.format('https://api-ropsten.etherscan.io/api?module=account&action=tokennfttx&contractaddress=%s&page=1&offset=100&sort=asc&apikey=%s', contractaddress, myApi);
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
                errMsg: "Fail to inquery tx",
                errDetail: JSON.parse(body)
            }
        }
        res.send(JSON.stringify(data));
    });
});

async function getHistory(req, res){ //제조사 생성내역, 거래내역 조회
    let address;
    let userRef = db.collection("users").doc(req.params.uid);
    let warningRef = db.collection("administrator").doc("warning").collection("warning"); // 관리자 db에 warning 삽입
    let time = req.params.time;
    let timechk = 0;
    let ts;
    if(time !== 0){
        timechk = 1;
        let date = new Date(time);
        ts = Math.floor(date.getTime()/1000);
    }
    await userRef.get()
        .then(doc => {
            if(!doc.exists){
                console.log('No such users');
            }else{
                address = doc.data().addr;
                //console.log(address);
            }
            return null;
        }).catch(err => {
            let data = {
                estatus: "Fail",
                errMsg: "Fail to get user address",
                errDetail: err
            }
            res.send(JSON.stringify(data));
        });


    let url = util.format('https://api-ropsten.etherscan.io/api?module=account&action=tokennfttx&contractaddress=%s&address=%s&page=1&offset=100&sort=asc&apikey=%s', contractaddress, address, myApi);
    let data = new Object();
    request(url, (err, response, body) =>{
        if(!err && response.statusCode === 200){
            
            let json = JSON.parse(body);
            let result = json['result'];

            let entered = new Array();
            let released = new Array();
            let stock = new Array();
            let txInfo = new Object();

            if(timechk === 1){
                for(tmp in result){
                    if(result[tmp]['timeStamp'] >= ts && result[tmp]['timeStamp'] <= (ts + 3600*24)){
                        txInfo = {
                            time: result[tmp]['timeStamp'],
                            tokenId: result[tmp]['tokenID'],
                            num: '1',
                            from: result[tmp]['from'],
                            to: result[tmp]['to']
                        }
    
                        if(result[tmp]['to'] === address.toLowerCase()){ //생성내역, 지금은 거래완료한 토큰도 보이는방식, 거래한토큰은 거르는식으로 구현해야함.
                            entered.push(txInfo);
                        }else{ //거래내역
                            released.push(txInfo);
                        }
                    }
                }
            }else{
                for(tmp in result){
                    //console.log('now : ' + tmp + ', ' + result[tmp]['to']);
                    txInfo = {
                        time: result[tmp]['timeStamp'],
                        tokenId: result[tmp]['tokenID'],
                        num: '1',
                        from: result[tmp]['from'],
                        to: result[tmp]['to']
                    }

                    if(result[tmp]['to'] === address.toLowerCase()){ //생성내역, 지금은 거래완료한 토큰도 보이는방식, 거래한토큰은 거르는식으로 구현해야함.
                        entered.push(txInfo);
                    }else{ //거래내역
                        released.push(txInfo);
                    }
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

                let warning = new Array(); //7일이상 경과시 경고 알림
                let now = Math.floor(+new Date()/1000);

                for(e_idx in stock){
                    let time = stock[e_idx].time;
                    //console.log(now - time);
                    if((now - time) >= 604800){ //7일경과
                        let tmp = {
                            tokenId : stock[e_idx].tokenId,
                            enteredTime : stock[e_idx].time,
                            passedTime : (now-time),
                            checkedTime : now
                        }
                        warning.push(tmp);

                        let warningRef2 = warningRef.doc(stock[e_idx].tokenId);
                        tmp.uid = req.params.uid;
                        warningRef2.set(tmp,{merge: true});
                    }
                }

                
                data = {
                    status: "Success",
                    enteredHistory: entered,
                    releasedHistory: released,
                    stockList: stock,
                    warning : warning
                }
            }
            
        }else{
            data = {
                status: "Fail",
                errMsg: "Fail to access API",
                errDetail: err
            };
        }
        res.send(JSON.stringify(data));
        
    });
}

function getTokenHistory(req, res){ //관리자가 조회할때 쓸 함수 
    let tokenId = req.params.tokenId;
    let url = util.format('https://api-ropsten.etherscan.io/api?module=account&action=tokennfttx&contractaddress=%s&page=1&offset=100&sort=asc&apikey=%s', contractaddress, myApi);

    request(url, (err, response, body) => {
        let result = new Object();
        if(!err && response.statusCode === 200){
            result = JSON.parse(body);
            result = result['result'];

            let tokenTxArr = new Array();
            for(let e_idx in result){ //result 중 tokenId에 해당하는 값만 리턴
                if(tokenId === result[e_idx]['tokenID']){
                    let txInfo = {
                        time: result[e_idx]['timeStamp'],
                        tokenId: result[e_idx]['tokenID'],
                        num: '1',
                        from: result[e_idx]['from'],
                        to: result[e_idx]['to']
                    }
                    tokenTxArr.push(txInfo);
                }
                //console.log(e_idx + " : " + result[e_idx]['tokenID']);
            }
            result = {
                status: "Success",
                tokenTx: tokenTxArr
            }
        }else{
            result = {
                status: "Fail",
                errMsg: "Fail to getTx in getTokenHistory",
                errDetail: err
            }
        }
        res.send(JSON.stringify(result));
    });
}

module.exports.getTokenHistory = getTokenHistory;
module.exports.getHistory = getHistory;