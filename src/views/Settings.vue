<template>
  <div class="settings-page f fr">
    <div class="settings-header">
      <h2 class="curent-settings-header">
        <span class="current-settings-placeholder">Settings for </span>
        <span class="current-settings-user">{{ user.name }}</span>
      </h2>
      <div class="settings-panel sn">
        <SettingsCard
          text=" <span class='dc'>App</span>"
          group="Friends"
          :properties="[]"
          :icon="require('@/assets/svg/icons/server.svg')"
          :circle="false"
          :style="`${current == 'app' ? 'border: var(--primary) 2px solid;' : ''}`"
          v-on:clicked="current = 'app'"
        />
        <SettingsCard
          text=" <span class='cc'> You</span><br>"
          group="Self"
          :properties="[user.name, user.id]"
          :icon="user.avatar"
          :circle="true"
          :style="`${current == 'self' ? 'border: var(--primary) 2px solid;' : ''}`"
          v-on:clicked="current = 'self'"
        />

        <SettingsCard
          text=" <span class='pc'>Devices</span>"
          group="Settings"
          :properties="[devices.total]"
          :icon="require('@/assets/svg/icons/devices.svg')"
          :circle="false"
          :style="`${current == 'devices' ? 'border: var(--primary) 2px solid;' : ''}`"
          v-on:clicked="current = 'devices'"
        />
        <SettingsCard
          text=" <span class='wc'>Friends & Communities</span>"
          group="Friends"
          :properties="[
            `<b class='cc'>${friends.length}</b> Friend${friends.length == 1 ? '' : 's'}`,
            `<b class='cc'>0</b> Communities`,
          ]"
          :icon="require('@/assets/svg/icons/server.svg')"
          :circle="false"
          :style="`${current == 'friends' ? 'border: var(--primary) 2px solid;' : ''}`"
          v-on:clicked="current = 'friends'"
        />
      </div>
    </div>
    <div class="settings-body f fr">
      <div class="user-settings right-pane" v-if="current == 'app'">
        <span class="sn">App Settings</span>
        <div class="versioning right">
          <span class="right sn dc">{{ $version }}</span>
        </div>
        <div class="main-app-body center f fc">
          <div class="notifications">
            <span class="large b center">Notifications</span>
            <div class="notifications-action center">
              <BaseButton
                :text="currentSoundState"
                height="55px"
                type="confirm"
                :icon="require('@/assets/svg/icons/play.svg')"
                v-on:clicked="testNotification"
                :disabled="currentSoundState == 'Playing...'"
              />
            </div>
            <div class="notification-editor flex-grid-l">
              <div class="notification-sound-editor center fc">
                <span class="center medium">Sound</span>
                <span :class="'current-sound ' + uploadedSound.color">{{
                  uploadedSound.name
                }}</span>
                <BaseButton
                  text="Upload Sound"
                  :icon="require('@/assets/svg/icons/sound.svg')"
                  v-on:clicked="uploadSound"
                  height="45px"
                />
                <BaseButton
                  text="Silence"
                  :icon="require('@/assets/svg/icons/mute.svg')"
                  type="danger"
                  height="45px"
                />
              </div>
              <div class="notification-sound-editor center fc" v-if="false">
                <span class="center medium center fc">Response</span>
                <input
                  type="text"
                  placeholder="Use $user to show the user's name and $content to show the content of the message"
                />
              </div>
            </div>
          </div>
          <div class="styles" v-if="false">
            <span class="large b">Styles</span>
            <div class="styles-editor">
              <span class="center medium">Chat</span>
              <div class="style-options f fr flex-grid-l">
                <div
                  class="message-wrapper style-option"
                  @click="(e) => (selectedChatStyle = { name: 'Chat Message', e: e.srcElement })"
                >
                  <b class="center">Message</b>
                  <ChatMessage
                    :user="{ id: '0', name: 'Example User' }"
                    :text="'Example Content'"
                    :id="'12882'"
                    :sender="true"
                    :randomvalue="6"
                    :margins="'0'"
                    :created="{ milli: 0 }"
                    :continuation="false"
                    class="sn"
                  />
                </div>
                <div
                  class="message-wrapper style-option f fc"
                  @click="(e) => (selectedChatStyle = { name: 'Message Input', e: e.srcElement })"
                >
                  <b class="center">Input</b>
                  <span
                    type="text"
                    placeholder="Message @Example User"
                    class="forminput name sn"
                    id="app-name"
                    contenteditable="true"
                    >Example Message</span
                  >
                </div>
                <div
                  class="message-wrapper style-option"
                  @click="(e) => (selectedChatStyle = { name: 'Channel Header', e: e.srcElement })"
                >
                  <b>Channel Info</b>
                  <div class="channelbar sn">
                    <div class="innerbar fr" :id="`channel-`">
                      <img
                        :src="require('@/assets/svg/icons/missing.svg')"
                        width="45"
                        height="45"
                        class="channel-icon rounded"
                      />
                      <span class="channel-data"
                        ><span class="channel-name">Example User</span>
                        <span class="channel-id"> (0230290391)</span></span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="color-picker center f fc">
              <b>{{ selectedChatStyle != null ? `${selectedChatStyle.name}` : "Select A Box" }}</b>
              <div class="color-pall" style="opacity: 0.5">
                <input
                  type="color"
                  name="color-pick"
                  :disabled="selectedChatStyle != null ? false : true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="user-settings right-pane" v-if="current == 'self' ? true : false">
        <span>Settings</span>
        <div class="self-profile">
          <span class="center profile-tag">Your Profile</span>
          <span class="center u-id">{{ user.id }}</span>
          <div class="profile-card center f fc">
            <img :src="user.avatar" height="128" width="128" class="circle self-avatar" />
            <span class="self-name">Brys</span>
            <div class="status f fr" v-if="user.status">
              <img
                :src="user.status.icon"
                v-if="user.status.icon"
                height="45"
                width="45"
                style="vertical-align: middle; margin-right: 5px"
              />
              <span class="status-text">{{ user.status.text }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="device-settings right-pane" v-if="current == 'devices'">
        <span>Devices</span>
        <div class="cards">
          <DeviceCard :device="devices.devices[0]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SettingsCard from "../components/app/global/Settings/SettingsCard.vue";
import ChatMessage from "../components/app/global/Chat/ChatMessage.vue";
import "vue-swatches/dist/vue-swatches.css";
import DeviceCard from "../components/app/global/Settings/DeviceCard.vue";
import BaseButton from "../components/base/BaseButton.vue";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
export default {
  name: "settings",
  props: {
    user: Object,
  },
  computed: {
    friends() {
      return this.$store.state.friends;
    },
  },
  methods: {
    testData(e) {
      console.log(e);
    },
    async uploadSound() {
      let path = await open({
        filters: [
          {
            name: "Sounds",
            extensions: ["mp3", "flac", "wav", "m4a"],
          },
        ],
      });
      let name = this.getFileFromPath(path);
      this.uploadedSound = {
        name: name,
        color: "cc",
        path: path,
      };
    },
    async testNotification() {
      this.Chatty.Notifier.sendToast({
        op: 2,
        type: "notify",
        d: {
          texts: [`Example Header`, "Example Message", "Second line"],
          textboxes: [
            {
              title: "Reply Message",
              placeholder: `Write to @Example User`,
              input: "reply",
              id: "textBox",
            },
          ],
          buttons: [
            {
              Content: "Reply",
              HintID: 'textBox',
              Arguments: 'reply_button',
              Icon: 'C:\\Users\\bryso\\Downloads\\reply.png'
            },
            {
              Content: "Ignore",
            },
          ]
        },
      });
      this.currentSoundState = "Playing...";
      try {
        let sound = await invoke("play_sound", { path: this.uploadedSound.path });
        this.currentSoundState = "Test";
      } catch (err) {
        this.currentSoundState = "Test";
      }
      

    },
  },
  components: { SettingsCard, ChatMessage, DeviceCard, BaseButton },
  async mounted() {
    this.requireModules("rest");
    let userMod = this.Chatty.Rest.getModule("user");
    let deviceReq = await userMod.getDevices(this.user.auth);
    let deviceJson = deviceReq.json;
    console.log(this.$store.state.friends);
    this.devices.total = `<b class="cc">${deviceJson.devices.length}</b> Connected device${
      deviceJson.devices.length == 1 ? "" : "s"
    }`;
    this.devices.devices = deviceJson.devices;
  },
  data() {
    return {
      devices: {
        total: "Loading...",
        devices: [],
      },
      selectedChatStyle: null,
      current: "app",
      uploadedSound: {
        color: "dc",
        name: "No sound selected",
        path: String,
      },
      currentSoundState: 'Test'
    };
  },
};
</script>

<style>
.settings-page {
  height: 100vh;
  color: var(--gray);
  flex-shrink: 0;
  padding: 5px;
}
.current-settings-header {
  font-size: 5px !important;
}
.current-settings-placeholder {
  font-weight: normal;
}
.settings-panel {
  width: 400px;
}
.right-pane {
  background: rgb(39, 39, 39);
  display: block;
  flex-grow: 1;
  padding: 5px;
}
.settings-body {
  flex-grow: 1;
  padding: 5%;
}
.self-profile {
  background: rgb(26, 26, 26);
  width: 100%;
  height: 20%;
  max-width: 300px;
  margin-right: auto;
  margin-left: auto;
  border-radius: 16px;
}
.profile-card {
  background: rgb(26, 26, 26);
  border-radius: 16px;
  padding: 10px;
}
.self-avatar {
  border: rgb(36, 36, 36) 4px solid;
  transition: all 70ms linear;
}
.self-avatar:hover {
  border-radius: 16px;
}
.self-name {
  font-size: 250%;
  color: var(--nqw);
  font-weight: bold;
  padding-bottom: 20px;
}
.profile-tag {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--nqw);
  opacity: 0.8;
}
.status-text {
  margin-bottom: auto;
  margin-top: auto;
  font-size: 150%;
}
.right {
  float: right;
}
.message-wrapper {
  background: #1b1b1b;
  padding: 10px;
  border-radius: 15px;
}
.large {
  font-size: 32px;
}
.medium {
  font-size: 22px;
}

.flex-grid-l {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
  gap: 10px;
}
.forminput {
  font-family: var(--oxy) !important;
  /* max-width: 50vw; */
  background: #1b1b1b;
  border: none;
  padding: 10px;
  transition: opacity 200ms linear, color 200ms linear;
  color: var(--nqw);
  opacity: 0.8;
  min-width: 145px;
  margin-top: auto;
  margin-bottom: auto;
  overflow-y: scroll;
  overflow-wrap: break-word;
}

.forminput:focus {
  outline: 0;
  border-bottom-color: #42b883;
  color: #e0e0e0;
  opacity: 1;
}
.style-option {
  background-color: rgb(46, 46, 46);
  transition: all 150ms ease;
  cursor: pointer;
}
.style-option:hover {
  background-color: rgb(24, 24, 24);
  border: var(--primary) 2px solid;
}

.innerbar {
  padding: 5px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 7px;
}
.channel-icon {
  transition: all 250ms ease;
  margin-right: 5px;
}
.channel-icon:hover {
  border-radius: 16px !important;
}
.channel-id {
  opacity: 0.7;
  color: gray;
}
.channel-name {
  font-weight: bold;
}
.channel-data {
  font-size: 26px;
  color: #fff;
}
.vue-swatches__wrapper {
  background-color: inherit;
  box-sizing: content-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 128px;
  height: 45px;
  padding: 0px;
  background-color: #533333;
}
input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
input[type="color"]::-webkit-color-swatch {
  border: none;
}
</style>
