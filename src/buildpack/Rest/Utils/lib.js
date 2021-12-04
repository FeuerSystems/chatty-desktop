import { Encrypt } from "../../Encryption/encrypt";

const encrypt = new Encrypt();

export async function timeoutResponse(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("TIMEOUT"));
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
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export class DefaultRestModule {
  constructor(restFetch) {
    this.restFetch = restFetch;
    this.endpoint = "https://chatty-api.feuer.tech";
  }
}
export class DM {
  constructor(client, auth) {
    this.client = client;
    this.auth = auth;
    this.endpoint = "https://chatty-api.feuer.tech";
  }

  async getMessages(dm, limit, after, auth) {
    const limitParsed = !limit || isNaN(limit) ? 50 : limit;
    const afterParsed = !after || isNaN(after) ? "" : `&after=${after}`;
    return await this.client.restFetch(
      `${this.endpoint}​/v2/user/@me/channels/${dm}/messages?limit=${limitParsed}${afterParsed}`,
      "messages",
      {
        method: "GET",
        headers: {
          Authorization: auth
        }
      }
    );
  }

  async sendDMMessage(dm, content, auth) {
    return await this.client.restFetch(`${this.endpoint}/v2/user/@me/channels/${dm}/messages`, "message", {
      method: "POST",
      headers: {
        Authorization: auth
      },
      body: JSON.stringify({
        content: content,
      }),
    });
  }
}
export class User {
  constructor(client) {
    this.client = client;
    this.endpoint = "https://chatty-api.feuer.tech/v2/user";
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
      throw new SyntaxError("An ID or Authorization is required");
    }
    switch (auth) {
      case null:
        if (reduce) {
          throw new TypeError("Can not request a user with no reduce plus no authorization");
        } else {
          return await this.client.restFetch(`${this.endpoint}/${id}`);
        }
      default:
        return await this.client.restFetch(
          `${this.endpoint}/${id}${!reduce || null ? "" : "&reduce=true"}`,
          "user",
          {
            method: "GET",
            headers: {
              Authorization: auth,
            },
          }
        );
    }
  }

  async getMe(auth) {
    if (!auth) throw new SyntaxError("Auth can't be null");
    return await this.client.restFetch(`${this.endpoint}/@me`, "user/me", {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    });
  }

  async create(email, password, username) {
    if (!email || !password) return SyntaxError("Email, nor password can be null");
    return await this.client.restFetch(`${this.endpoint}/@me/create`, "user/create", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: encrypt.hash(password),
        name: username,
        type: "signup",
      }),
    });
  }

  async login(email, password) {
    if (!email || !password) return SyntaxError("Email, nor password can be null");
    return await this.client.restFetch(`${this.endpoint}/@me/login`, "user/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: encrypt.hash(password),
      }),
    });
  }

  async getFriends(auth) {
    return await this.client.restFetch(`${this.endpoint}/@me/relationships`, "user/relationships", {
      method: "GET",
      headers: {
        Authorization: auth,
      },
    });
  }
  async addFriend(auth, id) {
    return await this.client.restFetch(
      `${this.endpoint}/@me/relationships/${id}`,
      "user/relationships/add",
      {
        method: "PUT",
        headers: {
          Authorization: auth,
        },
      }
    );
  }
  async denyFriend(auth, id) {
    return await this.client.restFetch(
      `${this.endpoint}/@me/relationships/pending/${id}/deny`,
      "user/relationships/pending/deny",
      {
        method: "DELETE",
        headers: {
          Authorization: auth,
        },
      }
    );
  }
  async acceptFriend(auth, id) {
    return await this.client.restFetch(
      `${this.endpoint}/@me/relationships/pending/${id}/accept`,
      "user/relationships/pending/accept",
      {
        method: "POST",
        headers: {
          Authorization: auth,
        },
      }
    );
  }
  async update(auth, typeChange, valueChange, animated, obj) {
    if (!obj) {
      return await this.client.restFetch(`${this.endpoint}/@me`, "user", {
        method: "PATCH",
        body: JSON.stringify({
          auth: auth,
          change: {
            type: typeChange,
            animated: animated,
            new: valueChange,
            obj: null,
          },
        }),
      });
    } else {
      return await this.client.restFetch(`${this.endpoint}/user/@me`, "user", {
        method: "PATCH",
        body: JSON.stringify({
          auth: auth,
          change: {
            type: typeChange,
            new: valueChange,
            obj,
          },
        }),
      });
    }
  }
}
