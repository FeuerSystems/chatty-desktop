<template>
  <div class="overlay-modal r f">
    <div class="overlay-inner">
      <div class="overlay-heading">
        <div class="default-actions" v-if="closeable">
          <img :src="require('@/assets/svg/icons/close.svg')" height="32px" width="32px" id="closeableClose" @click="close"/>
        </div>
        <slot name="head" />
      </div>
      <div class="overlay-body">
        <slot name="body" />
      </div>
      <div class="overlay-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "overlay",
  props: {
    closeable: Boolean,
  },
  methods: {
    close() {
      this.$emit("modal:close");
    }
  }
};
</script>

<style scoped>
.overlay-modal {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: rgba(24, 24, 24, 0.733);
  z-index: 5;
}
.overlay-inner {
  background: #2a2a2a;
  height: 50%;
  margin: auto;
  width: 50%;
  display: flex;
  border-radius: 15px;
}
.default-actions {
  display: inline-block;
  margin-left: 10px;
  margin-top: 10px;
}
#closeableClose {
  transition: all 50ms ease-in-out;
  
  background-color: #2f2f2f;
  border-radius: 50%;
  padding: 2px;
}
#closeableClose:hover {
  transform: scale(1.3);
  color: var(--danger) !important;
}
</style>
