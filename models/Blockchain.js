const Block = require('./Block.js');
const Transaction = require('./Transaction.js')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const debug = require('debug')('jamieCoin:blockchain');

class Blockchain{
  constructor(){
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  startGenesisBlock(){
    return new Block("23/07/21", "The very first block in the Chain", "0");
  }
  obtainLatestBlock(){
    return this.blockchain[this.blockchain.length - 1];
  }
  // addNewBlock(newBlock){
  //   newBlock.precedingHash = this.obtainLatestBlock().hash;
  //   //newBlock.hash = newBlock.computeHash();
  //   newBlock.proofOfWork(this.difficulty);
  //   this.blockchain.push(newBlock);
  // }
  addTransaction(transaction){
    if(!transaction.fromAddress || !transaction.toAddress){
      throw new Error('Transaction must include a from and to address');
    }
    if(!transaction.isValid()){
      throw new Error('Cannot add invalid transactions to the blockchain');
    }
    this.pendingTransactions.push(transaction);
    debug('transaction added: %s', transaction);
  }


  minePendingTransactions(miningRewardAddress){
    let rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    let block = new Block(Date.now(), this.pendingTransactions, this.obtainLatestBlock().hash);
    block.proofOfWork(this.difficulty);

    debug('Block successfully mined!');
    this.blockchain.push(block);

    this.pendingTransactions = [];
    }

  getBalanceOfAddress(address){
    let balance = 0;
    for(const block of this.blockchain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }
        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }
    debug('getBalanceOfAdrees: %s', balance);
    return balance;
  }

  getAllTransactionsForWallet(address){
    const txs = [];
    for (const block of this.blockchain){
      for (const tx of block.transactions){
        if (tx.fromAddress === address || tx.toAddress === address){
          txs.push(tx);
        }
      }
    }
  }

  checkChainzAllGood(){
    const realGenesis = JSON.stringify(this.startGenesisBlock());
      if (realGenesis !== JSON.stringify(this.blockchain[0])) {
        return false;
      }
      for (let i = 1; i < this.blockchain.length; i++) {
        const currentBlock = this.blockchain[i];
        const previousBlock = this.blockchain[i - 1];
        if (previousBlock.hash !== currentBlock.precedingHash) {
          return false;
        }
        if (!currentBlock.hasValidTransactions()) {
          return false;
        }
        if (currentBlock.hash !== currentBlock.computeHash()) {
          return false;
        }
      }
      return true;
    }
  }



// console.log("Creating some transactions...");
// jamieCoin.createTransaction(new Transaction('address1', 'address2',100));
// jamieCoin.createTransaction(new Transaction('address2','address1',75));
// console.log(JSON.stringify(jamieCoin, null,4));
//
// console.log("Mining Jamie Coins in process...");
// jamieCoin.minePendingTransactions("Jamie's address");


// jamieCoin.addNewBlock(new Block("24/07/2021", {sender: 'Crescent Dragonwagon', recipient: 'Crispin Dragonwagon', quantity: 75}));
// jamieCoin.addNewBlock(new Block("25/07/2021", {sender: 'Tooty McFruity', recipient: 'Bugzy Malone', quantity: 80}));
// console.log(JSON.stringify(jamieCoin, null,4));
//
module.exports = Blockchain;
