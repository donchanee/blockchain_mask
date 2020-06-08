const fb = require('./firebase_init');
require('date-utils');
const db = fb.firestore();

let userRef = db.collection("users");

function test(addr){
    let arr = new Array();

    return new Promise(resolve => {
        userRef.get().then(snapshot => {
            snapshot.forEach(doc => {
                let result = doc.data();
                let tmp = {
                    addr : result['addr'].toLowerCase(),
                    name : result['name']
                }
                arr.push(tmp);
            }); 
            resolve(arr);
        });
    });
}

async function test1(){
    let companyList = new Object();
    await test("0xc2988556ae24daf3a20b16d3eb4d970e43e3546d").then(result => {
        companyList = result;
    });
    
    console.log(companyList);
    for(tmp in companyList){
        console.log(tmp);
    }
}

test1();