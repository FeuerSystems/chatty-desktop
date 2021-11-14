<template>
  <div class="app">
    <span id="titlebar-title" data-tauri-drag-region><b>Chatty</b></span>
    <div data-tauri-drag-region class="titlebar">
      <div class="titlebar-button" id="titlebar-minimize" @click="minimize">
        <span alt="Minimize">🗕</span>
      </div>
      <div class="titlebar-button" id="titlebar-maximize" @click="maximize">
        <span alt="Maximize">🗗</span>
      </div>
      <div class="titlebar-button" id="titlebar-close" @click="close">
        <span alt="close">🗙</span>
      </div>
    </div>
    <transition name="fade">
      <router-view />
    </transition>
  </div>
</template>

<script>
import "./assets/app.css";
import { appWindow } from "@tauri-apps/api/window";

export default {
  name: "App",
  methods: {
    minimize() {
      appWindow.minimize();
    },
    maximize() {
      appWindow.toggleMaximize();
    },
    close() {
      appWindow.close();
    },
  },
};
</script>

<style>
#app {
  font-family: Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  border-radius: 20px;
}
.titlebar {
  height: 32px;
  background: #242424;
  user-select: none;
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
}
.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  color: gray;
  transition: all 120ms ease-in-out;
  text-align: center;
}
#titlebar-title {
  top: 0;
  left: 0;
  height: 30px;
  position: absolute;
  display: inline-block;
  background-image: linear-gradient(92deg, #f35626ab, #feab3aab);
  color: #f35626ab;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hue 10s infinite linear;
  overflow: hidden;
  user-select: none;
  padding: 8px;
  font-family: Arial;
  z-index: 2;
  font-smooth: always;
  z-index: 10;
}

#titlebar-close:hover {
  transform: scale(1.3);
  color: var(--danger) !important;
}
#titlebar-maximize:hover {
  transform: scale(1.2);
  color: var(--confirm) !important;
}
#titlebar-minimize:hover {
  transform: rotate(180deg) translateY(-15px) scale(1.2);
  color: var(--warning) !important;
}
body,
html {
  background: var(--dark);
  overflow: hidden;
  height: 100%;
  width: 100%;
}
#start-header {
  font-family: var(--oxy);
  font-weight: normal !important;
  animation: bringElementDown 200ms ease;
  margin-top: 55px;
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
  transition: all .3s linear;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.show-enter-active,
.show-leave-enter {
    transform: translateX(0);
    transition: all .3s linear;
}
.show-enter,
.show-leave-to {
    transform: translateX(100%);
}
</style>
