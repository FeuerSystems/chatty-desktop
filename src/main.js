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
import store from './store';
import { NotificationService } from './buildpack/Notification/NotificationService';
import Clipboard from 'v-clipboard';
import devtools from '@vue/devtools';
import VueSmoothScroll from 'vue2-smooth-scroll';
import VueResource from 'vue-resource';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueOffline from 'vue-offline'


// Set Decorations to false, we have our own icons :)
appWindow.setDecorations(false);
// Disable production tip
Vue.config.productionTip = false;
// Create our file manager dep
Vue.prototype.FileManager = new FileManager();

Vue.mixin(ChattyMixin);
Vue.use(devtools);
Vue.use(VueSweetalert2);
Vue.use(MotionPlugin);
Vue.use(VTooltip);
Vue.use(Clipboard);
Vue.use(VueSmoothScroll);
Vue.use(VueResource);
Vue.use(Toast);
Vue.use(VueOffline);
Vue.prototype.$version = "1.9.5";
Vue.prototype.$hash = "63b1f796aa850ee9fc4721a7cf626b9293be9a5e";
Vue.prototype.$changelog = [
  "Added call support (DEV ONLY)",
  "Notifications are now fully supported",
  "Settings page was reworked",
  Vue.prototype.$version
]
// Error handle ALL components
Vue.config.errorHandler = function (err, vm, info) {
  const log = (location, text, obj) => {
    if (!obj) {
        console.log(
            `%c ${location} %c ${text} %c`,
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #FCFAFF; font-weight: bolder; font-family: Arial;',
            'background:#2a2a2a ; padding: 1px; border-radius: 0 3px 3px 0;  color: #5865F2; font-family: Arial;',
            'background:transparent'
        )
    } else {
        console.log(
            `%c ${location} %c ${text} %c`,
            'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #FCFAFF; font-weight: bolder; font-family: Arial;',
            'background:#2a2a2a ; padding: 1px; border-radius: 0 3px 3px 0;  color: #5865F2; font-family: Arial;',
            'background:transparent',
            obj
        )
    }
    
}
  log(`[ErrorHandler] - From "${vm.$options.name}" ${vm.$options.parent == null ? '' : `(Parent: ${vm.$parent.$options.name})`}`, `Stack Below ⮛`);
  console.log(err);
}
new Vue({
  render: (h) => h(App),
  router,
  store,

  async created() {
    let core = new ChattyCore({
      allowExperiments: true,
      developer: true,
      production: false 
    }, Vue.prototype);
    core.build();
    let notifier = new NotificationService({
      port: 6789,
      os: 'WIN'
    });
   
    Vue.prototype.Chatty.Notifier = notifier;
  }
}).$mount('#app');
