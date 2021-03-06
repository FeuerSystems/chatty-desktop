import EventEmitter from '../Core/Utils/EventEmitter';
import Events from './ChattySocketEvents';
import Logger from '../Core/Logging/Logger';
import Decoder from './API/Decoder';
import { getOS, getBrowserName } from '../Core/Utils/BrowserUtils';

export default class ChattySocket {
  constructor(config) {
    this.encoding = config.encoding;
    (this.host = config.host), (this.region = config.preferredRegion);
    this.cache = {
      size: config.messageCacheSize,
      items: [],
    };
    this.events = new EventEmitter();
    this.logger = new Logger(0);
  }

  /**
   * Makes and waits for the websocket to connect or fail to connect, its async!
   * @returns {WebSocket}
   */
  async start() {
    const ctx = this;
    this.ws = new WebSocket(`${this.host}?compression=${this.encoding}`);
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
      op: 2,
      token: creds,
      properties: {
        os: getOS(),
        browser: getBrowserName(),
        buildNumber: '1.9.2',
      },
    };
    console.log(`[WS -> Login]: ${JSON.stringify(payload)}`, payload);
    this.ws.send(
      JSON.stringify(payload),
    );
  }

  /**
   * Add a valid decoder module to decode compressed messages
   * @param {Decoder} decoder
   */
  addDecoder(decoder) {
    this.decoder = decoder;
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
    if (!this.decoder) {
      console.warn('ATTENTION Getting events without a decoder is highly risky! Proceed at your own risk.'); // Warn anyone who tries to load the websocket without a decoder that its a bad idea because there would be no way to decode the messages from string or base64
    }
    this.ws.onopen = () => {
      this.events.emit(Events.Internal_Events.CONNECTED);
    };
    this.ws.onmessage = (data) => {
      const json = JSON.parse(this.decoder.decode(new Uint8Array(data.data)));
      const { op } = json;
      switch (op) {
        case Events.op.Dispatch: {
          this.events.emit('authenticated', json.d);
          console.log('[WS]: Authenticated', json.d);
          break;
        }
        case Events.op.Heartbeat: {
          this.events.emit('heartbeat', json.d);
          console.log('[WS]: ????', json.d);
          break;
        }
        case Events.op.Identify: {
          this.events.emit('identify', json.d);
          console.log('[WS]: Identify', json.d);
          break;
        }
        case Events.op.Presence: {
          this.events.emit('presence', json.d);
          console.log('[WS]: Presence', json.d);
          break;
        }
        case Events.op.Voice: {
          this.events.emit('voice', json.d);
          console.log('[WS]: Voice', json.d);
          break;
        }
        case Events.op.Resume: {
          this.events.emit('resume', json.d);
          console.log('[WS]: Resume', json.d);
          break;
        }
        case Events.op.Invalid: {
          this.events.emit('invalid', json.d);
          console.log('[WS]: Invalid', json.d);
          break;
        }
        case Events.op.HELLO: {
          this.events.emit('hello', json.d);
          console.log('[WS]: HELLO', json.d);
          break;
        }
        case Events.op.ACK: {
          this.events.emit('ack', json.d);
          console.log('[WS]: ACK', json.d);
          break;
        }
        case 9: {
          const { type } = json;
          switch (type) {
            case Events.Recieve_Event.Message: {
              this.events.emit('message', json.d);
              console.log('[WS -> Receive]: MESSAGE', json.d);
              break;
            }
            case Events.Recieve_Event.Presence: {
              this.events.emit('presence', json.d);
              console.log('[WS -> Receive]: Presence', json.d);
              break;
            }
            case Events.Recieve_Event.Profile: {
              this.events.emit('profile', json.d);
              console.log('[WS -> Receive]: Profile', json.d);
              break;
            }
            case Events.Recieve_Event.SELF_MESSAGE: {
              this.events.emit('self_message', json.d);
              console.log('[WS -> Self Message]: Self Message', json.d);
              break;
            }
          }
          break;
        }
      }
    };
    return this.events;
  }
}
