const SHA256 = require('crypto-js/sha256');

class Block{
  constructor(timestamp, transactions, precedingHash= ''){
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }
  computeHash(){
    return SHA256(this.precedingHash + this.timestamp + JSON.stringify(this.transactions)+this.nonce).toString();
  }

  proofOfWork(difficulty){
    while(this.hash.substring(0, difficulty) !==Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.computeHash();
    }
    console.log("BLOCK MINED: "+ this.hash)
  }
}
module.exports = Block;
