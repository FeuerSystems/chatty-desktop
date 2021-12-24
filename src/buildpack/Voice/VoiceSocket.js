import EventEmitter from '../Core/Utils/EventEmitter';

export default class VoiceSocket {
    constructor(host) {
        this.events = new EventEmitter();
        this.host = host;
    }
   /**
   * Makes and waits for the websocket to connect or fail to connect, its async!
   * @returns {WebSocket}
   */
    async start() {
        const ctx = this;
        this.ws = new WebSocket(`${this.host}/voice`);
        return new Promise(((resolve, reject) => {
          ctx.ws.onopen = function () {
            resolve(this.ws);
          };
          ctx.ws.onerror = function (err) {
            reject(err);
          };
        }));
      }

      async login(creds) {
        if (!this.ws) throw new Error("Websocket hasn't been started");
        let payload = {
          type: 1,
          d: {
              auth: creds
          }
        };
        console.log(`[VWS -> Login]: ${JSON.stringify(payload)}`, payload);
        this.ws.send(
          JSON.stringify(payload),
        );
      }

      startHeartbeat() {
        setInterval(() => {
          this.ws.send(
            JSON.stringify({
              op: 1,
            }),
          );
        }, 10000);
      }

      getStream() {
          this.ws.onopen = () => {
              this.events.emit('open');
          }
          this.ws.onmessage = (data) => {
              const json = JSON.parse(data.data);
              console.log(json);
              switch (json.type) {
                  case 2: {
                    this.events.emit('sfudispatch', json);
                    break;
                  }
              }
          }
      }
      sendRTC(payload) {
          this.ws.send(JSON.stringify(payload));
      }
}