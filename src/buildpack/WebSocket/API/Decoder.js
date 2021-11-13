import pako from 'pako';

export default class Decoder {
  constructor(encoding) {
    this.encoding = encoding;
  }

  decode(data) {
    if (this.encoding === 'none') {
      return data;
    }
    if (this.encoding === 'zlib') {
      const strData = atob(data);
      const charData = strData.split('').map((x) => x.charCodeAt(0));
      const binData = new Uint8Array(charData);
      return pako.inflate(binData, { to: 'string' });
    }
  }
}
