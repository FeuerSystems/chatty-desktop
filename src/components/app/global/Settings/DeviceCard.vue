<template>
    <div class="device-card">
        <img height="64" width="64" :src="require('@/assets/svg/icons/missing.svg')">
        <div class="device-details f fc">
        <span class="device-type">{{device.properties.browser}} ({{device.properties.os}}) <span class="device-extra">Running {{device.properties.buildNumber}}</span></span>
        <span class="device-ip">{{device.ip}}</span>
        </div>
    </div>  
</template>


<script>
export default {
    name: 'device',
    props: {
        device: Object
    }
}
</script>

<style scoped>
.device-card {
  justify-content: left;
  align-items: center;
  background: rgb(39, 39, 39);
  padding: 8px;
  border-radius: 5px;
  color: var(--nqw);
  transition: all 100ms ease;
  border: var(--primary-clicked) 1px solid;
  display: flex;
  
}
.device-type {
    font-size: large;
}
.device-extra {
    opacity: .8;
    font-size: smaller;
}
</style>