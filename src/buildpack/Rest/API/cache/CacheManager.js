import CacheItem from './CacheItem';
/**
 * Rest Client Cache Manager, cache REST requests! (They could save you time 😳)
 */
export default class CacheManager {
  constructor(limit) {
    this.name = 'Cache Manager';
    this.cache = new Map();
    this.limit = limit;
  }

  /**
     * Cache a valid Cache item in the rest cache
     * @param {CacheItem} CacheItem
     */
  addItem(item) {
    if (this.cache.size >= this.limit) {
      console.warn(`[RestClientCache] - Cache is FULL. Deleting last entry. Adding item with ID ${item.id}`, item);
      this.cache.delete(this.cache.keys[this.cache.keys.length - 1]);
      this.cache.set(item.id, item);
    } else {
      console.log(`[RestClientCache] - Adding item with ID ${item.id}`, item);
      this.cache.set(item.id, item);
    }
  }

  /**
     * Remove a cache item based on the id created
     * @param {String} id
     */
  removeItem(id) {
    this.cache.delete(id);
  }

  /**
     * Clear the entire cache
     */
  clear() {
    this.cache = new Map();
  }
}
