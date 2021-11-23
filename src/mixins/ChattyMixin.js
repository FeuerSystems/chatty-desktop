import ChattySocket from "../buildpack/WebSocket/ChattySocket";
import RestClient from "../buildpack/Rest/RestClient";
import Decoder from "../buildpack/WebSocket/API/Decoder";
export default {
  methods: {
    invertColor(hex) {
      function padZero(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }
      if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
      }
      // convert 3-digit hex to 6-digits.
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      if (hex.length !== 6) {
        throw new Error("Invalid HEX color.");
      }
      // invert color components
      var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
      // pad each with zeros and return
      return "#" + padZero(r) + padZero(g) + padZero(b);
    },
    /**
     * Format bytes as human-readable text.
     *
     * @param bytes Number of bytes.
     * @param si True to use metric (SI) units, aka powers of 1000. False to use
     *           binary (IEC), aka powers of 1024.
     * @param dp Number of decimal places to display.
     *
     * @return Formatted string.
     */
    readableFileSize(bytes, si = false, dp = 1) {
      const thresh = si ? 1000 : 1024;

      if (Math.abs(bytes) < thresh) {
        return bytes + " B";
      }

      const units = si
        ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
      let u = -1;
      const r = 10 ** dp;

      do {
        bytes /= thresh;
        ++u;
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

      return bytes.toFixed(dp) + " " + units[u];
    },
    async requireModules(...names) {
      if (!this.Chatty) {
        await this.setTimeoutPromise(5);
      }
      for (let n = 0; names.length > n; n++) {
        const name = names[n];
        switch (name) {
          // You shouldn't be using this anymore.. Theres no support for configuration.
          // case "ws":
          //   if (!this.Chatty.ws) {
          //     this.log(
          //       "SmartModules",
          //       `Chatty Socket is required on this page (${location.href}) but wasn't found.. Loading it now`
          //     );
             
          //     // console.log(this.Chatty.ws);
          //     // const socket = await this.Chatty.ws;
          //     // socket.addDecoder(new Decoder(socket.encoding));
          //     // await socket.start();
          //     // socket.ws.binaryType = 'arraybuffer';
          //     // this.Chatty.ws.startHeartbeat();
          //     // this.Chatty.ws.login(null);
          //     this.log("SmartModules", "Socket is loaded and user is logged in", this.Chatty.ws);
          //   } else if (this.Chatty.ws) {
          //     this.log("SmartModules", "Socket was already found to be connected. Reusing..");
          //   }
          //   break;
          case "rest":
            if (!this.Chatty.Rest) {
              this.log(
                "SmartModules",
                `Chatty REST is required on this page (${location.href}) but wasn't found.. Loading it now`
              );
              this.Chatty.Rest = new RestClient({
                version: 1,
                timeout: 5000,
                logrequests: true,
                cache: {
                  allow: true,
                  size: 500,
                },
                auth: this.$store.state.self.auth,
              });
              this.log("SmartModules", "REST client is loaded", this.Chatty.Rest);
            } else if (this.Chatty.Rest) {
              this.log("SmartModules", "REST Client is already active. Reusing.");
            }
            break;
        }
      }
    },
    log(location, text, obj) {
      if (!obj) {
        console.log(
          `%c ${location} %c ${text} %c`,
          "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #FCFAFF; font-weight: bolder; font-family: Arial;",
          "background:#2a2a2a ; padding: 1px; border-radius: 0 3px 3px 0;  color: #5865F2; font-family: Arial;",
          "background:transparent"
        );
      } else {
        console.log(
          `%c ${location} %c ${text} %c`,
          "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #FCFAFF; font-weight: bolder; font-family: Arial;",
          "background:#2a2a2a ; padding: 1px; border-radius: 0 3px 3px 0;  color: #5865F2; font-family: Arial;",
          "background:transparent",
          obj
        );
      }
    },
  },
};
