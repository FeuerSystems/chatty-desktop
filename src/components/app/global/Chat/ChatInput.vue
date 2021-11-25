<template>
  <div class="chat-input f fc">
    <slot>
      <!-- We want main content here -->
    </slot>

    <span
      type="text"
      :placeholder="`Message @${getCurrent.name}`"
      class="forminput name"
      id="app-name"
      contenteditable="true"
      @keypress.enter="sendMessage"
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
  },
  methods: {
    async sendMessage(e) {
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
}
.forminput {
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
}

.forminput:focus {
  outline: 0;
  border-bottom-color: #42b883;
  color: #e0e0e0;
  opacity: 1;
}
</style>
