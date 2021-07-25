const Block = require('./Block.js');
const Transaction = require('./Transaction.js')

class Blockchain{
  constructor(){
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  startGenesisBlock(){
    return new Block(0, "23/07/21", "The very first block in the Chain", "0");
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
  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(), this.pendingTransactions);
    block.proofOfWork(this.difficulty);
    this.blockchain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  getBalanceofAddress(address){
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
    return balance;
  }

  checkChainzAllGood(){
    for (let i = 1; i < this.blockchain.length; i++){
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i-1];

      if(currentBlock.hash !== current.Block.computeHash()){
        return false;
      }
      if(currentBlock.precedingHash !== precedingBlock.hash){
        return false;
      }
      return true;
    }
  }
}

let jamieCoin = new Blockchain();
console.log("Creating some transactions...");
jamieCoin.createTransaction(new Transaction('address1', 'address2',100));
jamieCoin.createTransaction(new Transaction('address2','address1',75));
console.log(JSON.stringify(jamieCoin, null,4));

console.log("Mining Jamie Coins in process...");
jamieCoin.minePendingTransactions("Jamie's address");
// jamieCoin.addNewBlock(new Block("24/07/2021", {sender: 'Crescent Dragonwagon', recipient: 'Crispin Dragonwagon', quantity: 75}));
// jamieCoin.addNewBlock(new Block("25/07/2021", {sender: 'Tooty McFruity', recipient: 'Bugzy Malone', quantity: 80}));
// console.log(JSON.stringify(jamieCoin, null,4));
//
module.exports = Blockchain;
