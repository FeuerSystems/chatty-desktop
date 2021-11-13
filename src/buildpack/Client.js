const endpointRaw = 'chatty-api.feuer.tech';

class Client {
  constructor(emitter) {
    this.ws = new WebSocket(`wss://${endpointRaw}/ws`);
    this.emitter = emitter;
  }

  start() {
    this.ws.onopen = (data) => {
      console.log({ type: 'CONNECTED', data: { url: data.target.url, timestamp: data.timeStamp, type: data.type } });
    };
  }
}
