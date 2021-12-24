<template>
  <transition name="fade">
    <div v-if="show" class="loading-page">
      <div class="loading-logo-container center fc">
        <span id="logo-text"><b id="top-logo-text">Chatty</b></span>
        <span class="version-info b">{{ $version }}</span>
        <br />
        
        <div class="scrollable-container fc">
             <dynamic-marquee class="f fc" repeatMargin="20" :speed="{type: 'pps', number: 35}">
	         <span class="change" v-for="(change, index) in $changelog" :key="index"><span class="change-arrow">⮞</span> {{ change }} <span class="change-arrow">⮜</span><br></span>
	    </dynamic-marquee>
        </div>
        <div class="loading-info">
          <span :class="(ready) ? 'cc' : ''">{{text}}</span> 
        </div>
      </div>
    </div>
  </transition>
</template>
<script>

import DynamicMarquee from 'vue-dynamic-marquee';

export default {
  props: {
    show: Boolean,
    text: {
      type: String,
      required: false,
      default: "Loading",
    },
    changes: {
      type: Array,
      required: false,
      default: () => ["Nothing yet :c"]
    },
    ready: Boolean
  },
  mounted() {},
  components: {DynamicMarquee},
  data: () => ({
    showMobileLogo: false,
    // text: 'Loading Chatty',
    // loading: false,
  }),
  methods: {
    //   start() {
    //     this.loading = true;
    //   },
    //   finish() {
    //     this.loading = false;
    //   },
    //   changeText(text) {
    //     this.log('Loader', `Updating Loader Text! '${this.text}' -> ${text}`);
    //     this.text = text;
    //   }
  },
};
</script>
<style scoped>
.loading-page {
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 1rem;
  text-align: center;
  font-size: 3rem;
  font-family: sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  background: #252525;
  transition: backdrop-filter 0.2s;
  z-index: 5;
  overflow: hidden;
}
.loading-logo {
  width: 4%;
  min-width: 64px;
  height: auto;
  animation: fadeIn 200ms linear forwards;
  vertical-align: top;
  position: absolute;
  animation: none;
  color: transparent;
  background-clip: initial;
  background-image: none;
  overflow: hidden;
}
.mobile-loading-logo {
  width: 50%;
  min-width: 72px;
  height: auto;
  animation: fadeIn 200ms linear forwards;
  display: none;
}
#bottom-logo-text {
  font-family: var(--default-font);
  font-size: 1em;
  color: #8a45fe;
  animation: fadeIn 200ms linear forwards;
  background: #252525;
  border-radius: 15px;
  padding-left: 15px;
  padding-right: 15px;
  bottom: 0px;
  width: 100vw;
  overflow: hidden;
}
#top-logo-text {
  background-image: linear-gradient(92deg, #f35626, #feab3a);
  color: #f35626;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: hue 10s infinite linear;
  font-size: 100px;
  overflow: hidden;
}
#logo-text {
  font-family: var(--info-font);
  font-size: 5vw;
  animation: fadeIn 200ms linear forwards;
  background: #252525;
  overflow: hidden;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
@media screen and (max-width: 492px) {
  .loading-logo {
    display: none;
  }
  .mobile-loading-logo {
    display: block;
  }
}
.version-info {
  font-size: 22px;
  color: var(--primary);
}

.change {
  color: white;
  font-size: large;
  vertical-align: middle;
  margin-top: 2px;
}
li::before {
  content: "• ";
  color: var(--primary);
  vertical-align: middle;
}
ul {
  list-style: none;
}
.scrollable-container {
   max-width: 50vw;
   min-width: 30vw;
   height: 200px;
   display: flex;
   align-items: center;
   padding: 5px;
   border: var(--confirm) 2px solid;
   border-radius: 15px;
   overflow: scroll;
}
.scrollable-container::-webkit-scrollbar {
  display: none;
}
.change-arrow {
    color: var(--danger);
}
.loading-info {
  margin-top: 40px;
  font-size: 32px;
  color: var(--danger);
}
</style>
