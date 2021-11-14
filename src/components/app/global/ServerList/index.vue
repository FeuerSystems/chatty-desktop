<template>
  <div id="app-server-list">
    <ServerButton isHome :server="{ id: '-1' }" />
    <div class="separator" />
    <ServerButton v-for="server in friendData" :key="server.id" :server="server" />
    <ServerButton :server="{ id: 1, friendButton: true }"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ServerButton from "./ServerButton";
export default {
  name: "server-list",
  components: { ServerButton },
  computed: {
    friendData() {
      return this.$store.state.friends;
    },
  },
  mounted() {
   console.log(this.$store.state.friends);
  },
};
</script>

<style scoped>
.separator {
  width: 32px;
  border-bottom: solid 2px var(--primary);
  margin-bottom: 8px;
  border-radius: 15px;
}
</style>
