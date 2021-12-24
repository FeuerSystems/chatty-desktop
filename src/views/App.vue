<template>
  <div id="app-container">
    <Loading :show="loading" :text="loadingText" :ready="ready"/>
    <ChannelInfo id="channel-info" />
    <ComingSoon style="grid-area: SN; margin-top: 32px;"/>
    <ComingSoon style="grid-area: CL"/>
    <Chat :loading="true" />
<<<<<<< HEAD
     <ComingSoon style="grid-area: UL; width: 99%; height: 99.3%;"/>
=======
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
    <ServerList id="server-list" />
    <selfpanel
      :status="selfData.status"
      :name="selfData.name"
      :avatar="selfData.avatar"
      :id="selfData.id"
      :auth="auth.auth"
    />
    <ChatInput id="chat-input" />
  </div>
</template>

<script>
import selfpanel from "../components/app/global/selfpanel";
import ServerList from "../components/app/global/ServerList";
import ChannelInfo from "../components/app/global/ChannelInfo";
import Chat from "../components/app/global/Chat/index";
import ChattySocket from "../buildpack/WebSocket/ChattySocket";
import Decoder from "../buildpack/WebSocket/API/Decoder";
<<<<<<< HEAD
import ChatInput from "../components/app/global/Chat/ChatInput";
import { appWindow } from "@tauri-apps/api/window";
import Loading from "../components/base/loading.vue";
import ComingSoon from "../components/base/ComingSoon.vue";
export default {
  name: "app",
  components: { ServerList, selfpanel, ChannelInfo, Chat, ChatInput, Loading, ComingSoon },
=======

export default {
  name: "app",
  components: { ServerList, selfpanel, ChannelInfo, Chat },
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
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
    let dmManager = this.Chatty.Rest.getModule("dm");

    this.Chatty.Notifier.start();
<<<<<<< HEAD
    this.loadingText = "Connecting to Notifier";
    this.Chatty.Notifier.getStream();
    console.log(this.Chatty.Notifier.events);
    this.Chatty.Notifier.events.on("input", async (e) => {
      await appWindow.setFocus();
    });

=======
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
    this.$store.dispatch("setSelf", this.auth.user);
    let Rest = this.Chatty.Rest.getModule("user");
    this.loadingText = "Getting self";
    let selfCurrent = await Rest.getMe(this.auth.auth);
    if (selfCurrent.ok) {
      selfCurrent.json.auth = this.auth.auth;
      this.Chatty.AuthManager.saveLogin(JSON.stringify(selfCurrent.json), false);
      selfCurrent.json.auth = this.auth.auth;
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
    this.loadingText = "Getting friends";
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
    this.loadingText = "Starting WebSocket";
    this.Chatty.ws = new ChattySocket({
      encoding: "zlib",
      host: "wss://chatty-api.feuer.tech/ws",
      preferredRegion: "US",
      messageCacheSize: 50,
    });
    const ws = this.Chatty.ws;
    ws.addDecoder(new Decoder(ws.encoding));
    await ws.start();
    ws.ws.binaryType = "arraybuffer";
    ws.getStream();
    ws.startHeartbeat();
    this.loadingText = "Logging in";
    ws.login(this.auth.auth);
<<<<<<< HEAD
    let lastChannel;
    ws.events.on("message", (d) => {
      console.log(d);
=======
    ws.events.on('message', (d) => {
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
      let obj = {
        id: d.message.identifier,
        content: d.message.content,
<<<<<<< HEAD
        created: d.message.created,
        user: d.user,
=======
        user: d.user
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
      };
      lastChannel = d;
      ws.events.on("presence", (d) => {
        console.log(d);
      });
      this.$store.dispatch("addMessage", obj);
      this.Chatty.Notifier.sendToast({
        op: 2,
        type: "notify",
        d: {
<<<<<<< HEAD
          texts: [`Message from @${obj.user.name}`, obj.content],
          textboxes: [
            {
              title: `Reply to ${obj.user.name}`,
              placeholder: `Content`,
              input: "reply",
              id: "replyText",
            },
          ],
          buttons: [
            {
              Content: "Reply",
              HintID: "replyText",
              Arguments: "reply_button",
              Icon: "C:\\Users\\bryso\\Downloads\\reply.png",
            },
          ],
        },
      });

=======
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
      })
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
      var container = document.querySelector("#main-chat-messages");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
<<<<<<< HEAD
    this.loadingText = "Ready";
    this.ready = true;
    setTimeout(() => {
      this.loading = false;
    }, 150)
    this.Chatty.Notifier.events.on("activated", async (d) => {
      let text = d.Input.replyText;
      let req = await dmManager.sendDMMessage(lastChannel.user.id, text, this.auth.auth);
      console.log(req);
    });
=======
     
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
    
  },
  data() {
    return {
      loading: true,
      loadingText: 'Loading',
      ready: false
    }
  }
};
</script>

<style>
#app-container {
  display: grid;
  grid-template-columns: 5rem 15rem 1fr 13rem;
  grid-template-areas:
    "SL SN CI CI"
    "SL CL CD UL"
    "SL UI CA UL";
  height: 100vh;
}
.self-panel-container {
  grid-area: UI;
  display: flex;
<<<<<<< HEAD
  align-items: end;
  flex-wrap: nowrap;
  justify-content: flex-start;
  background: rgb(27, 27, 27);
  margin-top: auto;
=======
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  border-radius: 15px;
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
}
#server-list {
  grid-area: SL;
  display: flex;
  flex-direction: column;
  background-color: var(--tertiary);
  max-height: 85vh;
  padding: 15px;
  border-radius: 15px;
  overflow-y: scroll;
<<<<<<< HEAD
  margin-top: 24px;
  background: rgb(27, 27, 27);
=======
  margin-top: 30px;
  margin-right: 10px;
  background-color: #242424;
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
}
#server-list::-webkit-scrollbar {
  display: none;
}
#channel-info {
  grid-area: CI;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
      width: 84%;
}
.messages {
  grid-area: CD;
<<<<<<< HEAD
  width: 100%;
  margin-right: auto;
  overflow: scroll;
}
#chat-input {
  grid-area: CA;
=======
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
  width: 100%;
  height: 90%;
  background: #242424;
  border-radius: 15px;
  margin-top: 67px;
  margin-right: auto;
  overflow: scroll;
}

html,
body {
  font-family: var(--webf);
  background-image: url(../assets/svg/bg.svg);
}
</style>
