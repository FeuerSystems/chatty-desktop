<template>
<div class="self-panel">
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
        />
        <div class="user-card-contents">
          <span class="user-card-name">{{ name }}</span>

          <div class="user-card-status" v-if="status != null">
            <img v-if="status.img" :src="status.img" class="user-status-img" />
            <span v-if="status.text" class="user-status-txt">{{ status.text }}</span>
          </div>
        </div>
        <div class="user-card-options">
          <img
            :src="require('../../../assets/svg/icons/settings.svg')"
            :id="'user-settings-' + id"
            class="user-settings ca"
          />
        </div>
      </div>
    </div>
  </div>

  </div>  
</template>

<script>
import { open } from "@tauri-apps/api/dialog";
import Avatar from "../../settings/Avatar.vue";

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
      let path = await open({
        filters: [
          {
            name: "Images",
            extensions: ["jpg", "jpeg", "png", "gif"],
          },
        ],
      });
      if (path != null) {
        let file = await this.FileManager.retrieveBinaryExact(path);
        let base64 = await arrayBufferToBase64(new Uint8Array(file));
        this.editAvatar = true;
        this.newAvatar = "data:image/png;base64," + base64;
      }
    },
    showData(data) {},
  },
  components: { Avatar },
  data() {
    return {
      editAvatar: false,
      newAvatar: null,
      editedAvatar: this.avatar,
    };
  },
};
</script>

<style scoped>
.user-card-container {
  color: var(--nqw);
  height: 54px;
}
.user-card-inner {
  background: rgb(27, 27, 27);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  border-radius: 5px;
}
.user-card-img {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  vertical-align: middle;
  margin-top: 3px;
  transition: all 250ms ease;
  padding: 4px;
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
  font-family: var(--webf);
}
.user-card-options {
  display: flex;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
