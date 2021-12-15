<template>
  <div class="self-panel-container">
    <div class="self-panel" @contextmenu="contextMenu">
      <transition name="fade">
        <Avatar
          v-if="editAvatar"
          :img="newAvatar"
          :auth="auth"
          v-on:show="(boole) => (editAvatar = boole)"
          v-on:data="
            (data) => {
              editAvatar = false;
              showData(data);
            }
          "
          v-on:idoao="showData"
        />
      </transition>
      <div class="user-card-gl" :id="'uc-' + id">
        <div class="user-card-container">
          <div class="user-card-inner">
            <img
              class="user-card-img"
              :src="editedAvatar != null ? editedAvatar : require('@/assets/svg/icons/missing.svg')"
              :id="'self-img'"
              @click="openFileSave(0)"
              v-if="!loading"
            />
            <radial-progress-bar
              :diameter="45"
              :completed-steps="loaded"
              :total-steps="100"
              :strokeWidth="4"
              :innerStrokeWidth="7"
              startColor="#754df7"
              stopColor="#9170fa"
              class="user-card-img"
              v-if="loading"
            >
            </radial-progress-bar>
            <div class="user-card-contents">
              <span class="user-card-name">{{ name }}</span>

              <div class="user-card-status" v-if="status != null">
                <img v-if="status.img" :src="status.img" class="user-status-img" />
                <span v-if="status.text" class="user-status-txt">{{ status.text }}</span>
              </div>
            </div>
            <div class="user-card-options">
              <router-link
                :to="{
                  name: 'settings',
                  params: {
                    user: {
                      name: name,
                      status: status,
                      auth: auth,
                      avatar: avatar,
                      id: id,
                    },
                  },
                }"
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  height="30px"
                  width="30px"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  :id="'user-settings-' + id"
                  class="user-settings ca"
                >
                  <g>
                    <line fill="none" y1="501" x1="303.1" y2="501" x2="302.1" />
                    <g>
                      <path
                        d="m501,300.8v-91.7h-45.3c-5.3-22.4-14.3-43.3-26.4-62.1l32.9-32.7-64.9-64.6-33.4,33.3c-18.8-11.5-39.6-19.9-61.8-24.8v-47.2h-92.1v48.3c-22,5.4-42.6,14.4-61.1,26.4l-34.2-34-64.9,64.6 35.3,35.2c-2.8,4.6-5.3,9.2-7.7,14-7.5,14.3-13.2,30-17.1,45.7h-49.3v91.7h50.3c1.5,6 3.3,11.9 5.3,17.8 0.1,0.4 0.3,0.8 0.4,1.2 0,0.1 0.1,0.2 0.1,0.4 4.9,14.2 11.3,27.7 19.1,40.2l-35.5,35.3 64.9,64.6 35.1-34.9c18.3,11.5 38.6,20.2 60.2,25.4v48.1h91.1v-47.1c22.7-5 44-13.7 63.1-25.6l32.2,32 64.9-64.6-32.1-31.9c12-19.1 20.9-40.3 26-62.9h44.9zm-94.8,64l29.9,29.8-36.6,36.5-29.5-29.4c-24.7,18.9-54.4,31.7-86.7,36v42.4h-51.3v-42.7c-31.5-4.6-60.4-17.2-84.6-35.7l-31.6,31.5-36.6-36.5 32.4-31.3c-17.9-24-30-52.4-34.4-83.4h-45.3v-51.1h44l1.5-3.6c4.7-29.7 16.5-57.1 33.6-80.3l-32-31.9 36.6-36.5 31,31.9c24-18.5 52.8-31.2 84.1-36v-42.7h51.3v42.3c32,4.1 61.3,16.4 86,34.8l30.3-30.1 35.6,36.5-29.6,29.5c18.2,23.8 30.7,52.2 35.5,83.1h45.4v51.1h-44.7c-3.9,31.8-16.1,61.1-34.3,85.8z"
                      />
                      <path
                        d="m257,143.4c-61.8,0-113.1,50-113.1,112.6s51.4,112.6 113.1,112.6 113.1-51.1 113.1-112.6-51.3-112.6-113.1-112.6zm0,204.3c-51.3,0-92.1-40.7-92.1-91.7 0-51.1 41.9-91.7 92.1-91.7s92.1,40.7 92.1,91.7c0.1,51.1-41.8,91.7-92.1,91.7z"
                      />
                    </g>
                  </g>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { open } from "@tauri-apps/api/dialog";
import Avatar from "../../settings/Avatar.vue";
import Overlay from "./Overlay.vue";
import RadialProgressBar from "vue-radial-progress";
function arrayBufferToBase64(buffer) {
  return new Promise((resolve, reject) => {
    var blob = new Blob([buffer], {
      type: "application/octet-binary",
    });
    var reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onload = function (evt) {
      var dataurl = evt.target.result;
      resolve(dataurl.substr(dataurl.indexOf(",") + 1));
    };
    reader.onerror = (error) => reject(error);
  });
}
export default {
  name: "usercard",
  props: {
    auth: String,
    avatar: String,
    name: String,
    id: String,
    status: {
      text: String,
      img: String,
    },
  },
  mounted() {
    let self = this;
    this.requireModules("rest");
    window.addEventListener(
      "newava",
      function (data) {
        console.log(data.detail);
        self.editedAvatar = data.detail.avatar;
      },
      false
    );
  },
  methods: {
    async openFileSave(type) {
      let commit = this.$toast('This will take awhile.. Tauri only supports encoding data in JSON..', {timeout: false});
      let path = await open({
        filters: [
          {
            name: "Images",
            extensions: ["jpg", "jpeg", "png", "gif"],
          },
        ],
      });
     
      if (path != null) {
        let ex = path.split(".").pop();
        let file = await this.FileManager.retrieveBinaryExact(path);
        let base64 = await arrayBufferToBase64(new Uint8Array(file));
        this.$toast.dismiss(commit);
        let processing;
        if (ex == "gif") {
          this.loading = true;
          let gifProgressUpload = (e) => {
            let percentage = (e.loaded / e.total) * 100;
            this.loaded = percentage;
            this.log("Upload Image", `Current percent is ${percentage}`);
            if (percentage === 100) {
              this.log("Upload Image", `Processing...`);
              processing = this.$toast("Processing your avatar, this will only take a minute!", {
                timeout: false,
              });
            }
          };
          this.$http
            .patch(
              "https://chatty-api.feuer.tech/v2/user/@me",
              JSON.stringify({
                auth: this.auth,
                change: {
                  type: "avatar",
                  animated: true,
                  new: base64,
                  obj: null,
                },
              }),
              {
                uploadProgress: gifProgressUpload,
              }
            )
            .then(async (r, e) => {
              let json = await r.json();
              this.editedAvatar = json.avatar;
              this.loading = false;
              this.$toast.dismiss(processing);
              this.$dispatch('setSelf', json);
            });
          return;
        }
        this.editAvatar = true;
        this.newAvatar = `data:image/${ex};base64,` + base64;
      }
    },
    showData(data) {},
    contextMenu(e) {
      e.preventDefault();
    },
  },
  components: { Avatar, RadialProgressBar },
  data() {
    return {
      editAvatar: false,
      newAvatar: null,
      editedAvatar: this.avatar,
      loading: false,
      loaded: String,
    };
  },
};
</script>

<style>
.user-card-container {
  color: var(--nqw);
}
.user-card-inner {
  background: rgb(27, 27, 27);
  display: flex;
  align-items: center;
}
.user-card-img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  vertical-align: middle;
  margin-top: 3px;
  transition: all 250ms ease;
  padding: 4px;
  object-fit: cover;
}
.user-card-status {
  display: flex;
  margin-top: 4px;
  margin-left: 12px;
}
.user-card-name {
  margin-left: 15px;
  text-align: center;
  margin-top: 1px;
  font-weight: bold;
}
.user-settings {
  margin-top: 5px;
  margin-left: 10px;
  transition: all 100ms ease-in-out;
  fill: var(--nqw);
  padding: 5px;
}
.user-settings:hover {
  fill: var(--primary);
}
.user-status-img {
  height: 22px;
  width: 22px;
  border-radius: 50%;
  margin-top: 1px;
  transition: all 250ms ease;
}
.user-status-img:hover {
  cursor: alias;
  opacity: 0.8;
}
.user-card-img:hover {
  opacity: 0.8;
  cursor: alias;
}
.user-status-txt {
  text-align: center;
  margin-left: 5px;
  opacity: 0.8;
  font-family: Arial;
}
.user-card-options {
  display: flex;
  margin-left: auto;
  margin-right: auto;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
