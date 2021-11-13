export default class CacheItem {
  constructor(url, data, created, type, id) {
    this.url = url;
    this.data = data;
    this.created = created;
    this.type = type;
    this.id = id;
  }
}
