import ChattySocket from '../buildpack/WebSocket/ChattySocket';
import RestClient from '../buildpack/Rest/RestClient';
import Decoder from '../buildpack/WebSocket/API/Decoder';
export default {
  methods: {
    async requireModules(...names) {
      if (!this.Chatty) {
        await this.setTimeoutPromise(5);
      }
      for (let n = 0; names.length > n; n++) {
        const name = names[n];
        switch (name) {
          case 'ws':
            if (!this.Chatty.ws) {
              this.log(
                'SmartModules',
                `Chatty Socket is required on this page (${location.href}) but wasn't found.. Loading it now`,
              );
              this.Chatty.ws = new ChattySocket({
                encoding: 'none',
                host: 'wss://chatty-api.feuer.tech/ws',
                preferredRegion: 'US',
                messageCacheSize: 0,
              });
              const socket = await this.Chatty.ws;
              socket.addDecoder(new Decoder(socket.encoding));
              await socket.start();
              this.Chatty.ws.startHeartbeat();
              this.Chatty.ws.login(localStorage.getItem('account'));
              this.log('SmartModules', 'Socket is loaded and user is logged in', this.Chatty.ws);
            } else if (this.Chatty.ws) {
              this.log('SmartModules', 'Socket was already found to be connected. Reusing..');
            }
            break;
          case 'rest':
            if (!this.Chatty.Rest) {
              this.log(
                'SmartModules',
                `Chatty REST is required on this page (${location.href}) but wasn't found.. Loading it now`,
              );
              this.Chatty.Rest = new RestClient({
                version: 1,
                timeout: 5000,
                logrequests: true,
                cache: {
                  allow: true,
                  size: 500,
                },
                auth: localStorage.getItem('account'),
              });
              this.log('SmartModules', 'REST client is loaded', this.Chatty.Rest);
            } else if (this.Chatty.Rest) {
              this.log('SmartModules', 'REST Client is already active. Reusing.');
            }
            break;
        }
      }
    },
    log(location, text, obj) {
        if (!obj) {
            console.log(
                `%c ${location} %c ${text} %c`,
                'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #FCFAFF; font-weight: bolder; font-family: Arial;',
                'background:#2a2a2a ; padding: 1px; border-radius: 0 3px 3px 0;  color: #5865F2; font-family: Arial;',
                'background:transparent'
            )
        } else {
            console.log(
                `%c ${location} %c ${text} %c`,
                'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #FCFAFF; font-weight: bolder; font-family: Arial;',
                'background:#2a2a2a ; padding: 1px; border-radius: 0 3px 3px 0;  color: #5865F2; font-family: Arial;',
                'background:transparent',
                obj
            )
        }
        
    },
  },
};
