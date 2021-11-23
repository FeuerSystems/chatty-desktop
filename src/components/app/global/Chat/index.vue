<template>
  <transition name="fade">
    <div
      class="messages fc if"
      id="main-chat-messages"
      style="z-index: 5"
      v-if="current"
      @mouseenter="hoverChat = true"
      @mouseleave="hoverChat = false"
    >
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :user="message.user"
        :text="message.content"
        :sender="!(self.id === message.user.id)"
        :randomvalue="self"
        :margins="currentMarginValue"
      />
      <ChatInput id="chat-input">
        <div>
            <span class="ta cc slider-ctx">Message Margin</span>
          <div class="chat-context">
            <input
              type="range"
              id="chat-spacing"
              name="chat-spacing"
              min="0"
              max="100"
              @input="updateMargin"
              v-model="stateMarginValue"
            />
          </div>
        </div>
      </ChatInput>
    </div>
  </transition>
</template>

<script>
import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
export default {
  components: { ChatMessage, ChatInput },
  computed: {
    messages() {
      return this.$store.state.messages;
    },
    current() {
      return this.$store.state.currentChannel;
    },
    self() {
        return this.$store.state.self;
    }
  },
  methods: {
    updateMargin(e) {
      this.currentMarginValue = e.srcElement.value + "%";
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
</style>
