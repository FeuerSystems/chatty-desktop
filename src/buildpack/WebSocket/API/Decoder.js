import pako from 'pako';

export default class Decoder {
  constructor(encoding) {
    this.encoding = encoding;
    this.decoder = new TextDecoder();
  }

  decode(data) {
    if (this.encoding === 'none') {
      return this.decoder(data);
    }
    if (this.encoding === 'zlib') {
      return pako.inflate(data, { to: 'string' });
    }
  }
}
