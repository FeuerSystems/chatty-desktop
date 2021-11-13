import CacheItem from './API/cache/CacheItem';
import CacheManager from './API/cache/CacheManager';
import {
  timeoutResponse, makeid, DM, User,
} from './Utils/lib';

export default class RestClient {
  constructor(config) {
    this.version = config.version;
    this.timeout = config.timeout;
    this.logrequests = config.logrequests;
    this.cache = {
      allow: config.cache.allow,
      size: config.cache.size,
    };
    this.auth = config.auth;
    this.cacheManager = new CacheManager(this.cache.size);
    this.modules = new Map();
  }

  async restFetch(url, type, data) {
    return timeoutResponse(5000, fetch(url, data)).then(async (res) => {
      if (res === typeof Error) {
        console.warn(`[REST] - Request ${url} FAILED.`, res);
        return {
          ok: false,
        };
      } if (!res.ok) {
        const json = await res.json();
        console.warn(`[REST] - Request ${url} NON_OK EXCEPTION.`, res.status);
        return {
          ok: false,
          json: json,
          status: res.status,
        };
      }

      const json = await res.json();
      this.cacheManager.addItem(new CacheItem(url, json, Date.now(), type, makeid(10)));
      return {
        ok: true,
        json: json,
        status: res.status,
      };
    }).catch((err) => {
      console.warn(`[REST] - Request ${url} FAILED.`, err);
    });
  }

  getModule(name) {
    if (this.modules.has(name)) {
      return this.modules.get(name);
    } if (!this.modules.has(name)) {
      switch (name) {
        case 'general': {
          break;
        }
        case 'dm': {
          const dm = new DM(this, this.auth);
          this.modules.set('dm', dm);
          return dm;
        }
        case 'server': {
          break;
        }
        case 'user': {
          const user = new User(this);
          this.modules.set('user', user);
          return user;
        }
      }
    }
  }
}
