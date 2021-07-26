const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const debug = require('debug')('jamieCoin:blockchain');

class Transaction{
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
  calculateHash() {
   return crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount + this.timestamp).digest('hex');
 }
  signTransaction(signingKey){
    if(signingKey.getPublic('hex') !== this.fromAddress){
      throw new Error("You cannae do tha' yer scallywag!");
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }
  isValid(){
    if(this.fromAddress === null) return true;
      if(!this.signature || this.signature.length === 0){
      throw new Error('No signature in this transaction');
      }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
module.exports = Transaction;
