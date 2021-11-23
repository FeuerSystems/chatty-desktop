<template>
  <div
    :class="`message ${sender ? 'sender' : 'receiever'}`"
    :style="(sender) ? `margin-left: ${margins}` : `margin-right: ${margins}`"
    @mouseenter="showContext = true"
    @mouseleave="showContext = false"
  >
    <div :class="`message-container fr ${sender ? 'sender1' : 'receiever1'}`">
      <img
        :src="user.avatar == null ? require('@/assets/svg/icons/missing.svg') : user.avatar"
        class="user-message-avatar"
      />
      <div class="contents-wrap fc wrap">
        <div class="details">
          <span
            ><span class="user-message-name">{{ user.name }} </span>
            <span class="user-message-id">({{ user.id }})</span></span
          >
        </div>
        <div class="contents">
          <span class="message-text-contents">{{ text }}</span>
        </div>
      </div>
      <transition name="fade">
        <div class="context-menu" v-if="showContext">
          <v-swatches
            v-model="color"
            row-length="5"
            :popover-x="sender ? 'right' : 'left'"
            v-on:input="colorChange"
            showFallback
            fallback-input-type="color"
          >
            <img slot="trigger" :src="require('@/assets/svg/icons/colorpick.svg')" />
          </v-swatches>
        </div>
      </transition>
    </div>
    <div class="markers"></div>
  </div>
</template>

<script>
import VSwatches from "vue-swatches";
import "vue-swatches/dist/vue-swatches.css";
export default {
  props: {
    text: String,
    user: Object,
    sender: Boolean,
    margins: {
      type: String,
      required: false,
      default: 'auto'
    }
  },
  mounted() {
    console.log(this.props);
  },
  components: { VSwatches },
  data() {
    return {
      showContext: false,
      color: "#1CA085",
    };
  },
  methods: {
    colorChange(e) {
      let root = document.documentElement;
      root.style.setProperty("--msg-name", this.invertColor(e));
      switch (this.sender) {
        case true: {
          return root.style.setProperty("--send", e);
          
        }
        case false: {
          return root.style.setProperty("--receive", e);
        }
      }
    },
  },
};
</script>

<style scoped>
.user-message-avatar {
  width: 40px;
  height: 40px;
  vertical-align: top;
  /* margin-top: auto; */
  margin-bottom: auto;
  border-radius: 50%;
  border: #2b2b2b 4px solid;
  transition: all 250ms ease-in-out;
}
.user-message-avatar:hover {
   border-radius: 16px;
}
.message-container {
  background: #424242;
  display: inline-flex;
  padding: 5px;
  width: fit-content;
  margin-top: 5px;
  border-radius: 15px;
  padding-right: 62px !important;
  position: relative;
  
}
.sender1 {
  transition: background 50ms ease;
  background: var(--send) !important;
  margin-left: 10px;
  animation: slideSideways 150ms ease;
}
.receiever1 {
  transition: background 50ms ease;
  background: var(--receive) !important;
  margin-right: 10px;
  animation: slideSideways 150ms ease;
}
.sender {
  margin-right: auto;
}
.receiever {
  margin-left: auto;
}
.message-text-contents {
  color: white;
  font-family: var(--webf);
  white-space: pre-line;
}
.contents {
  margin-left: 10px;
  
}
.details {
    color: var(--msg-name);
    font-weight: bold;
}
.user-message-id {
 opacity: .8;
}
.contents-wrap {
  max-width: 300px;
  overflow-wrap: anywhere;
}
.context-menu {
  position: absolute;
  float: top;
  right: 10px;
  top: 6px;
}
.user-message-id {
  opacity: 0.6;
}
@keyframes slideSideways {
    from {
        transform: translateX(-100%);
    }
  to {
    transform: translateX(0);
  }
}
</style>
