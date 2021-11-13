const hasher = require('sha512');
const rsa = require('node-rsa');

export class Encrypt {
  constructor() {}

  hash(str) {
    return hasher(str).toString('hex');
  }

  generatePair(store, id) {
    this.key = rsa({ b: 16 });
    const publicKey = this.key.exportKey('public');
    const privateKey = this.key.exportKey('private');
    const keyPair = new Map();
    keyPair.set('public', publicKey);
    keyPair.set('private', privateKey);
    if (store) {
      localStorage.setItem(id, JSON.stringify({
        PUBLIC: keyPair.get('public'),
        PRIVATE: keyPair.get('private'),
      }));
    }
    return keyPair;
  }

  findPair(id) {
    const pair = localStorage.getItem(id);
    const keyPair = new Map();
    if (!pair) {
      return null;
    }

    keyPair.set('public', JSON.parse(this.key).PUBLIC);
    keyPair.set('private', JSON.parse(this.key).PRIVATE);
  }
}
