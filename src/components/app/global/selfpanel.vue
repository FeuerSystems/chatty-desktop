<template>
  <div class="user-card-gl" :id="'uc-' + id">
    <div class="user-card-container">
      <div class="user-card-inner">
        <img class="user-card-img" :src="avatar" :id="'img-' + id" />
        <div class="user-card-contents">
          <span class="user-card-name">{{ name }}</span>

          <div class="user-card-status" v-if="status.text || status.img">
            <img v-if="status.img" :src="status.img" class="user-status-img" />
            <span v-if="status.text" class="user-status-txt">{{ status.text }}</span>
          </div>
        </div>
        <div class="user-card-options">

             <img :src="require('../../../assets/svg/icons/settings.svg')" :id="'user-settings-' + id" class="user-settings ca" >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "usercard",
  props: {
    avatar: String,
    name: String,
    id: String,
    status: {
      text: String,
      img: String,
    },
  },
};
</script>

<style scoped>
.user-card-container {
  color: var(--nqw);
  width: 240px;
  height: 54px;
  
}
.user-card-inner {
  background: rgb(27, 27, 27);
  display: flex;
  padding: 3px;
  border-radius: 5px;
}
.user-card-img {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  vertical-align: middle;
  margin-top: 3px;
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
}
.user-status-txt {
  text-align: center;
  margin-left: 5px;
  opacity: .8;
  font-family: var(--webf);
}
.user-card-options {
  display: flex;
  margin-left: 72px;
  
}

</style>