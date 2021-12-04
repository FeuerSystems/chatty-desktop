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
            console.log(json);
            let {op} = json;
            switch (op) {
                case 1: {
                    this.events.emit('ACK', data.d);
                    console.log(`[Notifier -> ACK]:`, data.d);
                    break;
                }
                case 2: {
                    this.events.emit("ERROR", {type: data.type, reason: data.reason});
                    console.log(`[Notifier -> ERROR]:`, {type: data.type, reason: data.reason});
                    break;
                }
                case 3: {
                    switch (data.type) {
                        case "create": {
                            this.events.emit("created", data.d);
                            console.log(`[Notifier -> Created]:`, data.d);
                            break;
                        }
                        case "input": {
                            this.events.emit("input", data.d);
                            console.log(`[Notifier -> Input]:`, data.d);
                            break;
                        }
                    }
                }
            }
            return this.events;
        }
    }
}