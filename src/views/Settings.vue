<template>
  <div class="settings-page">
    <div class="settings-header">
      <h2 class="curent-settings-header">
        <span class="current-settings-placeholder">Settings for </span>
        <span class="current-settings-user">{{ user.name }}</span>
      </h2>
    </div>
    <div class="settings-body f fr">
      <div class="settings-panel">
         <SettingsCard
          text=" <span class='cc'> You</span><br>"
          group="Self"
          :properties="[user]"
          :icon="user.avatar"
          :circle="true"
        />
        <SettingsCard
          text=" <span class='pc'>Devices</span>"
          group="Settings"
          :properties="['3 Connected devices']"
          :icon="require('@/assets/svg/icons/devices.svg')"
          :circle="false"
        />
      </div>
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
  components: { SettingsCard },
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
