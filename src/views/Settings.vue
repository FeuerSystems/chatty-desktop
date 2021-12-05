<template>
  <div class="settings-page f fr">
    <div class="settings-header">
      <h2 class="curent-settings-header">
        <span class="current-settings-placeholder">Settings for </span>
        <span class="current-settings-user">{{ user.name }}</span>
      </h2>
       <div class="settings-panel sn">
         <SettingsCard
          text=" <span class='cc'> You</span><br>"
          group="Self"
          :properties="[user.name, user.id]"
          :icon="user.avatar"
          :circle="true"
          v-tooltip="'Coming soon...'"
        />
        <SettingsCard
          text=" <span class='pc'>Devices</span>"
          group="Settings"
          :properties="[devices.total]"
          :icon="require('@/assets/svg/icons/devices.svg')"
          :circle="false"
        />
        <SettingsCard
          text=" <span class='wc'>Friends & Communities</span>"
          group="Friends"
          :properties="[`<b class='cc'>${friends.length}</b> Friend${(friends.length == 1) ? '' : 's'}`,`<b class='cc'>0</b> Communities`]"
          :icon="require('@/assets/svg/icons/server.svg')"
          :circle="false"
        />
      </div>
    </div>
    <div class="settings-body f fr"> 
    </div>
  </div>
</template>

<script>
import SettingsCard from "../components/app/global/Settings/SettingsCard.vue";
export default {
  name: "settings",
  props: {
    user: Object,
  },
  computed: {
    friends() {
      return this.$store.state.friends;
    }
  },
  components: { SettingsCard },
  async mounted() {
    this.requireModules('rest');
    let userMod = this.Chatty.Rest.getModule('user');
    let deviceReq = await userMod.getDevices(this.user.auth);
    let deviceJson = deviceReq.json;
    console.log(this.$store.state.friends);
    this.devices.total = `<b class="cc">${deviceJson.devices.length}</b> Connected device${(deviceJson.devices.length == 1) ? '' : 's'}`;
    this.devices.devices = deviceJson.devices;
  },
  data() {
    return {
      devices: {
        total: 'Loading...',
        devices: []
      }
    }
  }
};
</script>

<style scoped>
.settings-page {
  height: 100vh;
  color: var(--gray);
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
</style>
