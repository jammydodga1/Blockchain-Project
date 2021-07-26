const Blockchain = require('./models/blockchain');
const Transaction = require('./models/transaction');
const Block = require('./models/block');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('e4093bcf200f36ff2ade986924487ba35d963576c1ef378dc9799cf9bcc165ff')

const myWalletAddress = myKey.getPublic('hex');

const jamieCoin = new Blockchain();

jamieCoin.minePendingTransactions(myWalletAddress);

const tx1 = new Transaction(myWalletAddress, 'address2', 100);
tx1.signTransaction(myKey);
jamieCoin.addTransaction(tx1);

jamieCoin.minePendingTransactions(myWalletAddress);

const tx2 = new Transaction(myWalletAddress, 'address1', 50);
tx2.signTransaction(myKey);
jamieCoin.addTransaction(tx2);

jamieCoin.minePendingTransactions(myWalletAddress);

console.log();
console.log(`Jamie's balance is ${jamieCoin.getBalanceOfAddress(myWalletAddress)}`);

// jamieCoin.chain[1].transactions[0].amount = 10;

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', jamieCoin.checkChainzAllGood() ? 'Yes' : 'No');
