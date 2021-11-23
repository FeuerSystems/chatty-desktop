<template>
<transition name="fade">
    <div class="channelbar" v-if="channelData">
        <div class="innerbar fr" :id="`channel-${channelData.id}`">
            <img :src="(channelData.avatar == null) ? require('@/assets/svg/icons/missing.svg') : channelData.avatar" width="45" height="45" class="channel-icon rounded">
            <span class="channel-data"><span class="channel-name">{{channelData.name}}</span> <span class="channel-id">({{channelData.id}})</span></span>
        </div>
    </div>
    </transition>
</template>

<script>
export default {
    name: 'channel-info',
    computed: {
    channelData() {
      return this.$store.state.currentChannel;
    },
  },
}
</script>

<style scoped>
.innerbar {
    background: rgb(34, 34, 34);
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    width: fit-content;
    border: var(--confirm) 2px solid;
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
</style>