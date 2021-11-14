<template>
  <div id="app-container">
    <ServerList id="server-list" />
    <selfpanel
      :status="{
        text: selfData.status.text,
        img: selfData.status.img,
      }"
      :name="selfData.name"
      :avatar="selfData.avatar"
      :id="selfData.id"
      class="selfuser"
    />
  </div>
</template>

<script>
import selfpanel from "../components/app/global/selfpanel";
import ServerList from "../components/app/global/ServerList";
export default {
  name: "app",
  components: { ServerList, selfpanel },
  props: {
    auth: Object,
  },
  computed: {
    selfData() {
      return this.$store.state.self;
    },
  },
  async mounted() {
    this.log(this.auth);
    if (!this.auth) {
      location.href = "/";
    }
    this.$store.dispatch("setSelf", this.auth);
    this.requireModules("rest");
    let Rest = this.Chatty.Rest.getModule("user");
    let selfCurrent = await Rest.getMe(this.auth.auth);
    console.log(selfCurrent)
    if (selfCurrent.ok) { this.$store.dispatch("setSelf", selfCurrent.json); }
    else if (!selfCurrent.ok) {
      this.$store.dispatch("setSelf", {
        name: "Failed",
        avatar: require("../assets/svg/icons/missing.svg"),
        auth: this.auth.auth,
        status: {
          text: `(${selfCurrent.status})`,
        },
      });
    }
    let friends = await Rest.getFriends(this.auth.auth);
    if (!friends.ok) {
      this.$store.dispatch("addFriend", {
        name: "Friends failed to load!",
        id: 0,
        info: `Response of ${friends.status} was given (${friends.err})`,
        avatar: require("../assets/svg/icons/close.svg"),
        pending: false,
      });
      this.$store.dispatch("removeFriend", 0);
      return;
    }
    this.$store.dispatch("setFriends", friends.json);
    this.$store.dispatch("removeFriend", 0);
  },
};
</script>

<style scoped>
#app-container {
  display: grid;
  grid-template-columns: 71px 240px auto 240px;
  grid-template-rows: 46px auto 52px;
  grid-template-areas:
    "SL SN CI CI"
    "SL CL CD UL"
    "SL UI CD UL";
  height: 100vh;
}
.selfuser {
  grid-area: UI;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  border-radius: 15px;
}
#server-list {
  grid-area: SL;
  display: flex;
  flex-direction: column;
  background-color: var(--tertiary);
  max-height: 85vh;
  padding: 15px;
  border-radius: 15px;
  overflow-y: scroll;
  margin-top: 30px;
  margin-right: 10px;
  background-color: #242424;
}
#server-list::-webkit-scrollbar {
  display: none;
}
html,
body {
  font-family: var(--webf);
  background-image: url(../assets/svg/bg.svg);
}
</style>
