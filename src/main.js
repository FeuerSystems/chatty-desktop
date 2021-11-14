import Vue from 'vue';
import App from './App.vue';
import ChattyMixin from './mixins/ChattyMixin';
import ChattyCore from './buildpack/Core/ChattyCore';
import { appWindow } from "@tauri-apps/api/window";
import FileManager from './buildpack/Core/Utils/FileManager';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-dark/dark.css';
import { MotionPlugin } from '@vueuse/motion'
import router from './router';
import  VTooltip  from 'v-tooltip';
import store from './store'
// Set Decorations to false, we have our own icons :)
appWindow.setDecorations(false);
// Disable production tip
Vue.config.productionTip = false;
// Create our file manager dep
Vue.prototype.FileManager = new FileManager();

Vue.mixin(ChattyMixin);
Vue.use(VueSweetalert2);
Vue.use(MotionPlugin);
Vue.use(VTooltip);
new Vue({
  render: (h) => h(App),
  router,
  store,

  created() {
    let core = new ChattyCore({
      allowExperiments: true,
      developer: true,
      production: false 
    }, Vue.prototype);
    core.build();
  }
}).$mount('#app');
