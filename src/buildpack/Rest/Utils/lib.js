import { Encrypt } from '../../Encryption/encrypt';

const encrypt = new Encrypt();

export async function timeoutResponse(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        console.log(reason);
        clearTimeout(timer);
        reject(reason);
      });
  });
}
export function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export class DefaultRestModule {
  constructor(restFetch) {
    this.restFetch = restFetch;
    this.endpoint = 'https://chatty-api.feuer.tech';
  }
}

export class DM {
  constructor(client, auth) {
    this.client = client;
    this.auth = auth;
    this.endpoint = 'https://chatty-api.feuer.tech/';
  }

  async getMessages(dm, limit, after) {
    const limitParsed = !limit || isNaN(limit) ? 50 : limit;
    const afterParsed = !after || isNaN(after) ? '' : `&after=${after}`;
    return await this.client.restFetch(`${this.endpoint}/dms/${dm}/messages?auth=${this.auth}&limit=${limitParsed}${afterParsed}`, 'messages', {
      method: 'GET',
    });
  }

  async sendDMMessage(dm, content) {
    return await this.client.restFetch(`${this.endpoint}/user/@me/dms/${dm}/message`, 'message', {
      method: 'POST',
      body: JSON.stringify({
        auth: this.auth,
        content,
      }),
    });
  }
}
export class User {
  constructor(client) {
    this.client = client;
    this.endpoint = 'https://chatty-api.feuer.tech/v2/user';
  }

  // async getUser(how, value, reduce) {
  //     if (!reduce) {
  //         return await this.client.restFetch(`${this.endpoint}/user?how=${how}&key=${value}`, 'user', {
  //             method: 'GET'
  //         });
  //     } else {
  //         return await this.client.restFetch(`${this.endpoint}/user?how=${how}&key=${value}&reduce=true`, 'user', {
  //             method: 'GET'
  //         });
  //     }
  // }
  async getUser(id, reduce, auth) {
    if (!id && !auth) {
      throw new SyntaxError('An ID or Authorization is required');
    }
    switch (auth) {
      case null:
        if (reduce) {
          throw new TypeError('Can not request a user with no reduce plus no authorization');
        } else {
          return await this.client.restFetch(`${this.endpoint}/${id}`);
        }
      default:
        return await this.client.restFetch(`${this.endpoint}/${id}${!reduce || null ? '' : '&reduce=true'}`, 'user', {
          method: 'GET',
          headers: {
            Authorization: auth,
          },
        });
    }
  }

  async getMe(auth) {
    if (!auth) throw new SyntaxError("Auth can't be null");
    return await this.client.restFetch(`${this.endpoint}/@me`, 'user/me', {
      method: 'GET',
      headers: {
        Authorization: auth,
      },
    });
  }

  async create(email, password, username) {
    if (!email || !password) return SyntaxError('Email, nor password can be null');
    return await this.client.restFetch(`${this.endpoint}/@me/create`, 'user/create', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password: encrypt.hash(password),
        name: username,
        type: 'signup',
      }),
    });
  }

  async login(email, password) {
    if (!email || !password) return SyntaxError('Email, nor password can be null');
    return await this.client.restFetch(`${this.endpoint}/@me/login`, 'user/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password: encrypt.hash(password),
      }),
    });
  }

  async getFriends(user) {
    const friends = [];
    console.log(friends);
    await user.friends.forEach(async (element) => {
      friends.push(await this.getUser('id', element, false));
    });
    console.log(friends);
    return friends;
  }

  async update(auth, typeChange, valueChange, obj) {
    if (!obj) {
      return await this.client.restFetch(`${this.endpoint}/user/@me`, 'user', {
        method: 'PATCH',
        body: JSON.stringify({
          auth,
          change: {
            type: typeChange,
            new: valueChange,
            obj: null,
          },
        }),
      });
    }
    return await this.client.restFetch(`${this.endpoint}/user/@me`, 'user', {
      method: 'PATCH',
      body: JSON.stringify({
        auth,
        change: {
          type: typeChange,
          new: valueChange,
          obj,
        },
      }),
    });
  }
}
