<template>
  <div id="state">
    <div id="start-wrapper">
      <div class="c">
        <h2 id="start-header">Starting <b class="pc adjust">Chatty</b></h2>
      </div>

      <img
        :src="require('../assets/svg/icons/loading.svg')"
        width="100"
        height="100"
        style="opacity: 0.8"
        class="c"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import AuthManager from "../buildpack/Core/Utils/AuthManager";

export default {
  name: "State",
  async mounted() {
    try {
      await this.FileManager.makeDir(false, false);
      let authManager = new AuthManager(this.FileManager);
      Vue.prototype.Chatty.AuthManager = authManager;
      let info = JSON.parse(await authManager.grabLogin());
      if (info) {
        this.prevLogIn = true;
        this.$router.push("app");
      }
      if (!info) {
        this.prevLogIn = false;
        setTimeout(() => {
          this.$router.push("login");
        }, 250);
      }
    } catch (e) {
      document.querySelector("#start-header").innerHTML =
        "Chatty Desktop cannot be run in browser context";
    }
  },
  data() {
    return {
      prevLogIn: null,
    };
  },
};
</script>

<style>
#start-header {
  font-family: var(--oxy);
  font-weight: normal !important;
  animation: bringElementDown 200ms ease;
  margin-bottom: 95%;
}
#start-wrapper {
  width: 95vw;
  color: var(--nqw);
  font-size: large;
}
@keyframes bringElementDown {
  from {
    transform: translateY(-50px);
  }
  to {
    transform: translateY(0);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.img-c {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}

</style>
