<template>
  <transition name="fade">
    <div
      class="messages fc if"
      id="main-chat-messages"
      style="z-index: 5; overflow-x: hidden;"
      v-if="current"
      @mouseenter="hoverChat = true"
      @mouseleave="hoverChat = false"
      ref="main-chat"
    >
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :user="message.user"
        :text="message.content"
        :id="message.id"
        :sender="!(self.id === message.user.id)"
        :randomvalue="self"
        :margins="currentMarginValue"
        :created="message.created"
        :continuation="verifyContinuation(messages, message)"
      />
    </div>
  </transition>
</template>

<script>
import ChatMessage from "./ChatMessage";
export default {
  components: { ChatMessage },
  async mounted() {
    this.requireModules("rest");
    if (this.$store.state.currentChannel.id == 0) {
      this.$store.dispatch("setMessages", [{content: "Shhh you aren't supposed to see this 🤫", user: {name: 'Ur left testy', id: 0}, created: {milli: 0}}]);
      return;
    }
  },
  updated() {
    let dm = this.Chatty.Rest.getModule("dm");
    this.$nextTick(function () {
      let container = this.$refs["main-chat"];
      container.onscroll = async () => {
        let top = container.scrollTop;
        if (top === 0) {
          let before = container.children.item(0);
          if (this.$store.state.messageEnd === container.children.item(0).getAttribute("msgid"))
            return;
          let res = await dm.getMessages(
            this.$store.state.currentChannel.id,
            null,
            container.children.item(0).getAttribute("msgid"),
            this.$store.state.self.auth
          );

          this.$store.dispatch("setMessages", res.json.messages.concat(this.$store.state.messages));
          setTimeout(() => {
            const containerChildren = [...container.children];
            containerChildren.forEach((element) => {
              if (element.getAttribute("msgid") == before.getAttribute("msgid")) {
                container.scroll({
                  left: 0,
                  top: element.getBoundingClientRect().top,
                });
              }
            });
          }, 50);
        }
      };
    });
  },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    current() {
      return this.$store.state.currentChannel;
    },
    self() {
      return this.$store.state.self;
    },
  },
  methods: {
    updateMargin(e) {
      this.currentMarginValue = e.srcElement.value + "%";
    },
    checkOutput(e) {
      console.log(e);
    },
    verifyContinuation(messages, message) {
      if (messages[0] == message) return false;
      let prevMessage = messages[messages.findIndex((m) => m.id == message.id) - 1];
      if (
        prevMessage.user.id == message.user.id &&
        message.created.sec - prevMessage.created.sec <= 60
      ) {
        return true;
      } else if (prevMessage.user.id != message.user.id) {
        return false;
      }
    },
  },
  data() {
    return {
      hoverChat: false,
      stateMarginValue: 0,
      currentMarginValue: null,
    };
  },
};
</script>

<style scoped>
.slider-ctx {
  margin-left: 10px;
}
#chat-input {
  margin-top: auto;
}
input[type="range"] {
  overflow: hidden;
  -webkit-appearance: none;
  background-color: #241c1c;
  border-radius: 15px;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 12px;
  -webkit-appearance: none;
  color: var(--danger);
}

input[type="range"]::-webkit-slider-thumb {
  width: 12px;
  -webkit-appearance: none;
  height: 12px;
  margin-right: 2px;
  cursor: ew-resize;
  background: var(--primary);
  border-radius: 50%;
}
.fixed {
  position: fixed;
  margin-top: 100%;
}
</style>
