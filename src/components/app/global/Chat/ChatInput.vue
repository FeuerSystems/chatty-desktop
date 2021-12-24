<template>
  <div class="chat-input f fc">
    <slot>
      <!-- We want main content here -->
    </slot>

    <span
      type="text"
      :placeholder="`Message @${getCurrent.name}`"
      class="forminput name"
      id="chat-input"
      contenteditable="true"
      @keypress.enter="sendMessage"
      ref="chat-input"
    />
  </div>
</template>

<script>
export default {
  name: "ChatInput",
  computed: {
    getCurrent() {
      return this.$store.state.currentChannel;
    },
  },
  mounted() {
    this.requireModules("rest");
    let dmManager = this.Chatty.Rest.getModule("dm");
    let container = document.querySelector("#main-chat-messages");

    this.Chatty.Notifier.events.on("activated", async (d) => {
      let text = d.Input.replyText;
      let req = await dmManager.sendDMMessage(
        this.$store.state.currentChannel.id,
        text,
        this.$store.state.self.auth
      );
      let json = await req.json;
      this.$store.dispatch("addMessage", json.message);
      setTimeout(() => {
        container.scroll({
          x: 0,
          y: container.scrollTop,
        });
      }, 50);
    });
  },
  updated() {
    this.$nextTick(function () {
      let chat = this.$refs["chat-input"];
      chat.onpaste = (data) => {
        console.log(data);
      };
    });
  },
  methods: {
    async sendMessage(e) {
      let container = document.querySelector("#main-chat-messages");
      function isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
      }
      let text = e.srcElement.innerText;
      if (e.shiftKey) {
        text += "<br>";
        return;
      } else {
        e.preventDefault();
        if (isEmptyOrSpaces(text)) {
          text += "<br>";
          return;
        }
        e.srcElement.innerHTML = "";
        let dmManager = this.Chatty.Rest.getModule("dm");
        let req = await dmManager.sendDMMessage(
          this.$store.state.currentChannel.id,
          text,
          this.$store.state.self.auth
        );
        let json = await req.json;
        this.$store.dispatch("addMessage", json.message);
        console.log(container.scrollHeight);
        setTimeout(() => {
          container.scroll({
            x: 0,
            y: 20,
          });
        }, 50);
      }
    },
  },
  data() {
    return {
      currentText: "",
    };
  },
};
</script>

<style scoped>
.chat-input {
  margin-top: -20px;
  margin-right: auto;
  margin-left: auto;
  line-height: 30px;
   background: #1b1b1b;
}
.forminput {
<<<<<<< HEAD
    font-family: var(--oxy) !important;
    width: 99.3%;
    height: 100%;
    /* max-width: 50vw; */
    background: #1b1b1b;
    border: none;
    padding-top: 10px;
    padding-bottom: 10px;
    transition: opacity 200ms linear, color 200ms linear;
    color: var(--nqw);
    opacity: 0.8;
    /* margin-top: auto; */
    max-height: 250px;
    overflow-y: scroll;
    overflow-wrap: break-word;
=======
  font-family: var(--oxy) !important;
  font-size: 25px;
  width: 50vw;
  max-width: 50vw;
  background: #1b1b1b;
  border: none;
  padding: 10px;
  transition: opacity 200ms linear, color 200ms linear;
  color: var(--nqw);
  opacity: 0.8;
  max-height: 250px;
  overflow-y: scroll;
  overflow-wrap: break-word;
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
}
.forminput::-webkit-scrollbar {
  display: none;
}
.forminput:focus {
  outline: 0;
  border-bottom-color: #42b883;
  color: #e0e0e0;
  opacity: 1;
}
</style>
