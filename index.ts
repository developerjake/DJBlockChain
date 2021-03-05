import * as crypto from 'crypto';

class Transaction {
  constructor(
    public amount: number,
    public payer: string, // public key
    public payee: string, // private key
  ) { }

  toString() {
    return JSON.stringify(this);
  }
}

class Block {
  nonce = Math.round(Math.random() * 999999999);

  constructor(
    public previousHash: string,
    public transaction: Transaction,
    public timestamp = Date.now()    
  ) { }

  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }
}

class Chain {
  static instance = new Chain(); // Singleton

  chain: Block[];

  constructor() { // set the genesis block
    this.chain = [new Block(null, new Transaction(100, 'genesis', 'satoshi'))];
  }

  get previousBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(transaction.toString());
    const isValid = verifier.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.previousBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }

  mine(nonce: number) {
    let solution = 1;
    console.log('Mining... ⛏');

    while(true) {
      // MD5 is very similar to SHA256, but only 128 bits and faster to compute
      const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');

      if (attempt.substr(0, 4) === '0000') {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      ++solution;
    }
  }
}

class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
  }

  sendCrypto(amount: number, payeePublicKey: string) {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);
    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();
    const signature = sign.sign(this.privateKey);    
    Chain.instance.addBlock(transaction, this.publicKey, signature);
  }
}

// Example usage

const satoshi = new Wallet();
const jake = new Wallet();
const gabi = new Wallet();

satoshi.sendCrypto(50, gabi.publicKey);
gabi.sendCrypto(30, jake.publicKey);
jake.sendCrypto(5, gabi.publicKey);

console.log(Chain.instance);
