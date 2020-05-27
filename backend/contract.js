const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/df0ff335a16c463d96038903ff43987e'));
//const fb = require('firebase');
require('date-utils');

const fb = require("./firebase_init");

let Tx = require('ethereumjs-tx').Transaction;

let contractAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "burnToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_Message",
				"type": "string"
			}
		],
		"name": "DealEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "dealMasks",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "Illegal",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "_account",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_Message",
				"type": "string"
			}
		],
		"name": "Makemask",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_manuAddress",
				"type": "address"
			}
		],
		"name": "maskMaking",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_Message",
				"type": "string"
			}
		],
		"name": "SellEvent",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "sellMasks",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "tokenByList",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "_list",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "baseURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Masks",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let contractAddress = "0x2727b026EdB116B20196a1abF32e0cA8311E93e2";

const contract = new web3.eth.Contract(contractAbi, contractAddress);

let db = fb.firestore();

	db.collection("users").doc('administrator').get().then(doc => {
		const admin_account = doc.data().addr;
		const admin_pk = doc.data().privateKey;
		global.admin_account = admin_account;
		global.admin_pk = admin_pk;
		return null;
	}).catch(err=> {
		console.log(err);
	});

exports.getMaskInfo = ((req, res)=>{
	let maskNum = req.params.tokenId;
	const result = contract.methods.Masks(tokenId).call()
	.then((result) => {
			let data = {
				status: "Success",
				result: result
			}
			res.send(JSON.stringify(data));
			return null;
		})
	.catch((err) => {
		let data = {
			status: "Fail",
			errMsg: "Fail to get mask info",
			errDetail: err
		}
		res.send(JSON.stringify(data));
	})
   
});

exports.MaskMaking = ((req, res)=>{ // param : uid
	let uid = req.params.uid;
	let usersRef = db.collection("users").doc(uid);

	let newDate = new Date();
	let time = newDate.toFormat('YYYY-MM-DD');

	let daily = () => {
		let dailyRef = usersRef.collection("daily").doc(time);
		dailyRef.get()
		.then(doc => {
            if(!doc.exists){
                console.log('No such document!');
                dailyRef.set({
                    dailyMake:0,
                    dailySell:0
                }).then(()=>{
					daily();
					return null;
                }).catch(err=>{
					console.log(err);
				});
            }else{
                let result = doc.data();
                dailyRef.set({
                    dailyMake : result['dailyMake'] +1,  
                }, {merge: true});
                
			}
			return null;
        }).catch(err => {
			console.log("Err in daily add", err);
        })
	};
	
	usersRef.get().then(doc => {
		if(!doc.exists){
			let result = {
				status: "Fail",
				errMsg: "Don't exist user info"
			}
			res.send(JSON.stringify(result));
			return null;
		}else{
			let maker_account = doc.data().addr;

			const pk = Buffer.from(admin_pk,'hex');

			let callObject = {
				from: admin_account,
				gas: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
			}
			contract.methods.maskMaking(maker_account).call(callObject)
				.then((result) => {
					if(result === true){
						web3.eth.getTransactionCount(admin_account, (err, txCount) =>{
							if(!err){
								const txObject = {
									nonce: web3.utils.toHex(txCount),
									to: contractAddress,
									//value: web3.utils.toHex(web3.utils.toWei('0', 'ether')),
									gasLimit: web3.utils.toHex(2100000),
									gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
									data: contract.methods.maskMaking(maker_account).encodeABI()
								};
							
								const tx = new Tx(txObject, {'chain':'ropsten'});
								tx.sign(pk);
							
								const serializedTx = tx.serialize();
								const raw = '0x' + serializedTx.toString('hex');
								
								web3.eth.sendSignedTransaction(raw)
									.once('transactionHash', (hash) => {
										let result = new Object();
										result.status = 'Success'; //성공시
										result.txUrl = 'https://ropsten.etherscan.io/tx/' + hash; //트랜잭션 조회 url
										
										daily();
										res.send(JSON.stringify(result));
									})
									.on('error', (err) => {
										let result = new Object();
										result.status = 'Fail';
										result.errMsg = 'Error to transaction sending';
										result.errDetail = err;
				
										res.send(JSON.stringify(result));
									});
							}else{
								let data = {
									status: "Fail",
									errMsg: "Error to getTransactionCount",
									errDetail: err
								}
								res.send(JSON.stringify(data));
							}
							
						});
					}else{ //If result is not true
						let data = {
							status: "Fail",
							errMsg: "Failed to make mask"
						}
						res.send(JSON.stringify(data));
					}
					return null;
				}).catch(err=>{
					let data = {
						status: "Fail",
						errMsg: "Failed to make mask",
						errDetail: err
					}
					res.send(JSON.stringigy(data));
				});
		}
		return null;
	}).catch((err)=>{
		let data = {
			status: "Fail",
			errMsg: "Failed to check UID",
			errDetail: err
		}
		res.send(JSON.stringify(data));
	});
   
});

exports.dealMasks = ((req, res)=>{ //param: sender uid, receiver address, tokenId
	let send_uid = req.params.send_uid; //보내는사람 uid
	let recv_uid = req.params.recv_uid; //받는사람 지갑주소
	let token_Id = req.params.token_id; //보낼 토큰 ID

	let usersRef = db.collection("users").doc(send_uid);
	let recvRef = db.collection("users").doc(recv_uid);
	let recv_addr;

	recvRef.get()
	.then(doc => {
		if(!doc.exists){
			console.log('No such receiver address');
		}else{
			let result = doc.data();
			recv_addr = result.addr;
		}
		return null;
	}).catch(err=> {
		console.log('get receiver address Error : ', err);
	});

	let newDate = new Date();
	let time = newDate.toFormat('YYYY-MM-DD');

	let daily = () => {
		let dailyRef1 = usersRef.collection("daily").doc(time);
		let dailyRef2 = recvRef.collection("daily").doc(time);
		
		dailyRef1.get()
		.then(doc => {
            if(!doc.exists){
                console.log('No such document!');
                dailyRef1.set({
                    dailyEnter:0,
                    dailyRelease:0
                }).then(()=>{
					daily();
					return null;
                }).catch(err=> {
					console.log(err);
				});
            }else{
                let result = doc.data();
                dailyRef1.set({
                    dailyEnter : result['dailyEnter'] +1,  
                }, {merge: true});
			}
			return null;
        }).catch(err => {
			console.log("Err in daily add", err);
		});
		
		dailyRef2.get()
		.then(doc => {
			if(!doc.exists){
				console.log('No suchdocument!');
				dailyRef2.set({
					dailyEnter : 0,
					dailyRelease : 0
				}).then(() => {
					daily();
					return null;
				}).catch(err=>{
					console.log(err);
				});
				return null;
			}else{
				let result = doc.data();
				dailyRef2.set({
					dailyRelease : result['dailyRelease'] +1
				}, {merge: true});
			}
			return null;
		}).catch(err => {
			console.log("Err in daily add", err);
		});
	};

	usersRef.get().then(doc => {
		let account = doc.data().addr;
		let privatekey = doc.data().privateKey;

		const pk = Buffer.from(privatekey,'hex');
		const data = contract.methods.dealMasks(recv_addr, token_Id); //컨트랙트에서 리턴값받아서 보낼수있는지없는지 체크 예정

		let callObject = {
			from: account,
			gas: web3.utils.toHex(web3.utils.toWei('10', 'gwei'))
		};
	
		contract.methods.dealMasks(recv_addr, token_Id).call(callObject)
			.then((result) => {
				if(result === true){
					web3.eth.getTransactionCount(account, (err, txCount) =>{
						if(!err){
							const txObject = {
								nonce: web3.utils.toHex(txCount),
								to: contractAddress,
								//value: web3.utils.toHex(web3.utils.toWei('0', 'ether')),
								gasLimit: web3.utils.toHex(2100000),
								gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
								data: contract.methods.dealMasks(recv_addr, token_Id).encodeABI()
							};
							const tx = new Tx(txObject, {'chain':'ropsten'});
							tx.sign(pk);
						
							const serializedTx = tx.serialize();
							const raw = '0x' + serializedTx.toString('hex');
						
							web3.eth.sendSignedTransaction(raw)
								.once('transactionHash', (hash) => {
									let data = {
										status: "Success",
										txUrl: "transactionHash: https://ropsten.etherscan.io/tx/" + hash
									}
									daily();
									res.send(JSON.stringify(data));
								})
								.on('error', (err) =>{
									let data = {
										status: "Fail",
										errMsg: "Check your token in stock",
										errDetail: err
									}
									res.send(JSON.stringify(data));
								});
						}else{
							let data = {
								status: "Fail",
								errMsg: "Error to getTrasactionCount",
								errDetail: err
							}
							res.send(JSON.stringify(data));
						}
						
					});

				}else{
					let data = {
						status: "Fail",
						errMsg: "Return to revert from dealMasks in contract"
					}
					res.send(JSON.stringify(data));
				}
				return null;
			}).catch(err=>{
				let data = {
					status: "Fail",
					errMsg: "Return to revert from dealMasks in contract",
					errDeatil : err
				}
				res.send(JSON.stringify(data)); 
			})
		return null;
	})
	.catch((err) => {
		let data = {
			status: "Fail",
			errMsg: "Failed to check UID",
			errDetail: err
		};
		res.send(JSON.stringify(data));
	});
});

function getStockList(req, res){
	async function stock(item){ // 재고 db에넣기
		await countRef.doc(item).get()
		.then(doc => {
			if(!doc.exists)
				countRef.doc(item).set({count:500},{merge: true});
		})
		.catch(err =>{
			console.log(err);
		});
	}
	let uid = req.params.uid;
	
	let usersRef = db.collection("users").doc(uid);
	let countRef = usersRef.collection("inventory");
	usersRef.get().then(doc => {
		let account = doc.data().addr;

		//const pk = Buffer.from(admin_pk,'hex');
		let callObject = {
			from: admin_account,
			gas: web3.utils.toHex(web3.utils.toWei('20', 'gwei'))
		};
		let data = {
			status: "Success to make DB"
		}
		contract.methods.tokenByList(account).call(callObject)
			.then(result=> {
				data.result = result;
				for(idx in result){
					stock(result[idx]);
				}
				
				res.send(JSON.stringify(data));
				return null;
			})
			.catch((err) => {
				let data = {
					status: "Fail",
					errMsg: "Failed to get tokenByList",
					errDetail: err
				}
				console.log(JSON.stringify(data));
			});
		return null;
	})
	.catch((err) => {
		let data = {
			status: "Fail",
			errMsg: "Failed to check UID",
			errDetail: err
		};
		console.log(JSON.stringify(data));
	});
}



module.exports.getStockList= getStockList;


//MaskMaking('maker A', '0xc2988556Ae24daF3A20B16d3EB4D970E43e3546D', '7D88DB82FA83B7A1418FEB4A291496E0D72DDD08E8D15162B666A12043EC6F67');
//dealMasks('0xc2988556Ae24daF3A20B16d3EB4D970E43e3546D', '7D88DB82FA83B7A1418FEB4A291496E0D72DDD08E8D15162B666A12043EC6F67', '0xb93428830a28aD774DB9A3937fC8962fb4429785', '2')