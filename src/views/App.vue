<template>
  <div id="app-container">
    <ChannelInfo id="channel-info" />
    <Chat :loading="true" />
     <ChatInput id="chat-input">
        
      </ChatInput>
    <ServerList id="server-list" />
    <selfpanel
      :status="selfData.status"
      :name="selfData.name"
      :avatar="selfData.avatar"
      :id="selfData.id"
      :auth="auth.auth"
    />
    
  </div>
</template>

<script>
import selfpanel from "../components/app/global/selfpanel";
import ServerList from "../components/app/global/ServerList";
import ChannelInfo from "../components/app/global/ChannelInfo";
import Chat from "../components/app/global/Chat/index";
import ChattySocket from "../buildpack/WebSocket/ChattySocket";
import Decoder from "../buildpack/WebSocket/API/Decoder";
import ChatInput from "../components/app/global/Chat/ChatInput";
import {appWindow} from "@tauri-apps/api/window";
export default {
  name: "app",
  components: { ServerList, selfpanel, ChannelInfo, Chat, ChatInput },
  props: {
    auth: Object,
  },
  computed: {
    selfData() {
      return this.$store.state.self;
    },
  },
  async mounted() {
    this.requireModules("rest");
    if (!this.auth) {
      location.href = "/";
    }
    this.Chatty.Notifier.start();
     this.Chatty.Notifier.getStream();
    console.log(this.Chatty.Notifier.events);
    this.Chatty.Notifier.events.on('input', async (e) => {
      await appWindow.setFocus();
    });
    this.$store.dispatch("setSelf", this.auth.user);
    let Rest = this.Chatty.Rest.getModule("user");
    let selfCurrent = await Rest.getMe(this.auth.auth);
    if (selfCurrent.ok) {
      selfCurrent.json.auth = this.auth.auth;
      this.Chatty.AuthManager.saveLogin(JSON.stringify(selfCurrent.json), false);
      this.$store.dispatch("setSelf", selfCurrent.json);
      document.querySelector("#self-img").src = selfCurrent.json.avatar;
    } else if (!selfCurrent.ok) {
      this.$store.dispatch("setSelf", {
        name: "Failed",
        avatar: require("../assets/svg/icons/missing.svg"),
        auth: this.auth.auth,
        status: {
          text: `(${selfCurrent.status})`,
        },
      });
    }
    let friends = await Rest.getFriends(this.auth.auth);
    if (!friends.ok) {
      this.$store.dispatch("addFriend", {
        name: "Friends failed to load!",
        id: 0,
        info: `Response of ${friends.status} was given (${friends.err})`,
        avatar: require("../assets/svg/icons/close.svg"),
        pending: false,
      });
      this.$store.dispatch("removeFriend", 0);
      return;
    }
    this.$store.dispatch("setFriends", friends.json);
    this.$store.dispatch("removeFriend", 0);
    this.Chatty.ws = new ChattySocket({
      encoding: "zlib",
      host: "wss://chatty-api.feuer.tech/ws",
      preferredRegion: "US",
      messageCacheSize: 50,
    });
    const ws = this.Chatty.ws;
    ws.addDecoder(new Decoder(ws.encoding));
    await ws.start();
    ws.ws.binaryType = 'arraybuffer';
    ws.getStream();
    ws.startHeartbeat();
    ws.login(this.auth.auth);
    ws.events.on('message', (d) => {
      console.log(d);
      let obj = {
        id: d.message.id,
        content: d.message.content,
        created: d.message.created,

        user: d.user
      };
      ws.events.on('presence', (d) => {
        console.log(d);
      });
      this.$store.dispatch('addMessage', obj);
      this.Chatty.Notifier.sendToast({
        op: 2,
        type: 'notify',
        d: {
          texts: [`${obj.user.name} Sent a message`, obj.content]
          // textboxes: [{
          //   title: 'Reply Message',
          //   placeholder: `Write to ${obj.user.name}`,
          // }],
          // buttons: [{
          //   Content: "Reply",
          //   ID: `${obj.user.id}-2`
          // }]
        }
      });
      var container = document.querySelector("#main-chat-messages");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
   
     
    
   
  },
};
</script>

<style>
#app-container {
  display: grid;
  grid-template-columns: 71px 240px auto 240px;
  grid-template-rows: 46px auto 52px;
  grid-template-areas:
    "SL SN CI CI"
    "SL CL CD UL"
    "SL UI CA UL";
  height: 100vh;
}
.self-panel-container {
  grid-area: UI;

}
#server-list {
  grid-area: SL;
  display: flex;
  flex-direction: column;
  background-color: var(--tertiary);
  max-height: 100vh;
  padding: 15px;
  overflow-y: scroll;
  margin-top: 24px;
  background-color: #242424;
}
#server-list::-webkit-scrollbar {
  display: none;
}
#channel-info {
  grid-area: CI;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}
.messages {
    grid-area: CD;
    width: 100%;
    
    margin-top: 40px;
    margin-right: auto;
    overflow: scroll;
}
#chat-input {
  grid-area: CA;
  width: 100%;
}
html,
body {
  font-family: var(--webf);
  background-color: var(--dark);
}
</style>
