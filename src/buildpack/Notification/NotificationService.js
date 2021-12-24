import EventEmitter from '../Core/Utils/EventEmitter';
export class NotificationService {
    constructor({port, os}) {
        this.port = port;
        this.os = os;
        this.events = new EventEmitter();
    }
    async start() {
        const ctx = this;
        this.ws = new WebSocket(`ws://localhost:${this.port}`);
        return new Promise(((resolve, reject) => {
            ctx.ws.onopen = function () {
                resolve(this.ws);
              };
              ctx.ws.onerror = function (err) {
                reject(err);
              };
        }));
    }
    sendToast(data) {
        if (this.ws == null) throw Error("Websocket hasn't yet started!");
        this.ws.send(JSON.stringify(data));
    }
     async getStream() {
        await this.ws.onopen  
            console.log('[Notifier] - WS CONNECTED');
        this.ws.onmessage = (data) => {
            let json = JSON.parse(data.data);
            let {op} = json;
            switch (op) {
                case 1: {
                    this.events.emit('ACK', json);
                    console.log(`[Notifier -> ACK]:`, json);
                    break;
                }
                case 2: {
                    this.events.emit("ERROR", {type: json.type, reason: json.reason});
                    console.log(`[Notifier -> ERROR]:`, {type: json.type, reason: json.reason});
                    break;
                }
                case 3: {

                    switch (json.type) {
                        case "create": {
                            this.events.emit("created", json.d);
                            console.log(`[Notifier -> Created]:`, json.d);
                            break;
                        }
                        case "input": {
                            this.events.emit("input", json.d);
                            console.log(`[Notifier -> Input]:`, json.d);
                            break;
                        }
                        case "activated": {
                            this.events.emit("activated", json.d);
                        }
                    }
                    break;
                }
            }
            return this.events;
        }
    }
}