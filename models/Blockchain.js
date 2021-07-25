const Block = require('./Block.js');


class Blockchain{
  constructor(){
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock(){
    return new Block(0, "23/07/21", "The very first block in the Chain", "0");
  }
  obtainLatestBlock(){
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock){
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
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
console.log("Jamie Coin mining in progress...");
jamieCoin.addNewBlock(new Block(1, "24/07/2021", {sender: 'Crescent Dragonwagon', recipient: 'Crispin Dragonwagon', quantity: 75}));
jamieCoin.addNewBlock(new Block(2, "25/07/2021", {sender: 'Tooty McFruity', recipient: 'Bugzy Malone', quantity: 80}));
console.log(JSON.stringify(jamieCoin, null,4));

module.exports = Blockchain;
