<template>
  <div
    class="serverbutton fc"
    :class="{ 'serverbutton-isHome': isHome, 'serverbutton-hasNotification': server.notification }"
  >
    <!-- <div class="server-pill item-pill" :id="`server-pill-${server.id}`" /> -->
    <img
      :src="require('../../../../assets/svg/chatty.svg')"
      v-if="isHome && !server.friendButton"
      class="home-btn box"
    />
    <img
      v-else-if="!isHome && !server.friendButton"
      :src="
        server.avatar == null ? require(`../../../../assets/svg/icons/missing.svg`) : server.avatar
      "
      :class="server.pending ? 'server-icon pend' : 'server-icon server-icon-ac'"
      @mouseover="!server.pending ? setPill : ''"
      @mouseleave="!server.pending ? voidPill : ''"
      :s-id="server.id"
      @click="setActive"
      v-tooltip.right-start="
        `<div><span>${this.server.name}<br><br></span> <div class='status-tooltip'>Status: <div class='fr f'><span class='status-text-container-tooltip'>Text:</span>ifsif</div></div>`
      "
      :id="`server-item-false`"
      :pending="server.pending"
    />
    <div
      class="pending fc"
      v-if="server.pending"
      v-tooltip.right-start="`Pending friendship with <b class='pc b'>${server.name}</b>`"
      :id="`pending-${server.id}`"
    >
      <img
        :src="require('../../../../assets/svg/icons/important.svg')"
        class="pending-img"
        height="16px"
        width="16px"
      />
    </div>
    <img
      v-else-if="server.friendButton"
      :src="require('../../../../assets/svg/icons/addFriend.svg')"
      class="friend-btn"
      v-tooltip.right-start="'Add a new friend!'"
      @click="addFriend"
    />
    <div class="mentions" v-if="server.mentions">{{ server.mentions }}</div>
    <transition name="slide">
      <div
        class="options"
        v-if="showOptions"
        v-motion="'options'"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
        }"
      >
        <img
          :src="require('../../../../assets/svg/icons/close.svg')"
          v-tooltip.right-start="`<b class='dc b'>Deny</b> ${server.name}`"
          @click="denyFriend(server)"
        />
        <img
          :src="require('../../../../assets/svg/icons/check.svg')"
          v-tooltip.right-start="`<b class='cc b'>Accept</b> ${server.name}`"
          @click="acceptFriend(server)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    selected: Boolean,
    isHome: Boolean,
    // notification: Boolean,
    // mentions: Number,
    server: Object,
    friendButton: Boolean,
    // pending: Boolean,
  },
  mounted() {
    this.requireModules("rest");
  },
  data() {
    return {
      showOptions: false,
    };
  },
  methods: {
    async denyFriend(friend) {
      let req = await this.Chatty.Rest.getModule("user").denyFriend(
        JSON.parse(await this.Chatty.AuthManager.grabLogin()).auth,
        friend.id
      );
      if (req.ok) {
        this.$store.dispatch("removeFriend", this.$store.state.friends.indexOf(friend));
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Something went wrong when trying to deny that friend request",
          html: req.json.reason,
        });
      }
    },
    async acceptFriend(friend) {
      let req = await this.Chatty.Rest.getModule("user").acceptFriend(
        JSON.parse(await this.Chatty.AuthManager.grabLogin()).auth,
        friend.id
      );
      if (req.ok) {
        this.showOptions = false;
        this.$store.dispatch("removeFriend", this.$store.state.friends.indexOf(friend));
        this.$store.dispatch("addFriend", {
          id: req.json.id,
          info: req.json.name,
          name: req.json.name,
          avatar: req.json.avatar,
          p: false,
        });
      } else {
        this.$swal.fire({
          icon: "error",
          title: "Something went wrong when trying to accept that friend request",
          html: req.json.reason,
        });
      }
    },
    setPill(e) {
      //   let element = e.srcElement;
      //   console.log(element);
      //   console.log( document.querySelector(`#server-pill-${element.getAttribute("s-id")}`))
      //   document.querySelector(`#server-pill-${element.getAttribute("s-id")}`).style.display =
      //     "block";
    },
    voidPill(e) {
      //   let element = e.srcElement;
      //   console.log(element);
      //   document.querySelector(`#server-pill-${element.getAttribute("s-id")}`).style.display =
      //     "none";
    },
    async setActive(e) {
      let element = e.srcElement;
      let alreadyActive = document.querySelector(`#server-item-true`);
      console.log(element.getAttribute("pending"));
      if (element.getAttribute("pending") == "true") {
        element.style.border =
          element.style.border == "var(--warning) solid 2px" ? "none" : "var(--warning) solid 2px";
        this.showOptions = this.showOptions = !this.showOptions;
        return;
      }
      if (alreadyActive) {
        alreadyActive.style.border = "none";
        alreadyActive.setAttribute("active", false);
        alreadyActive.id = "server-item-false";
      }

      element.style.border = "var(--confirm) solid 2px";
      element.id = "server-item-true";
      element.setAttribute("active", true);
      this.$store.dispatch("setChannel", this.server);
      let dm = this.Chatty.Rest.getModule("dm");
      console.log(this.$store.state.self.auth);
      let res = await dm.getMessages(this.server.id, null, null, this.$store.state.self.auth);
      if (res.json) {
        this.$store.dispatch("setEndMessage", res.json.end);
        this.$store.dispatch("setMessages", res.json.messages);
        var container = document.querySelector("#main-chat-messages");
        if (container) {
          setTimeout(() => {
            container.scroll({ left: 0, top: container.scrollHeight, behavior: "smooth" });
          }, 50);
        }
      }
    },
    async addFriend() {
      const { value: friendID } = await this.$swal.fire({
        title: "Add a friend",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        html: "Ask your friend to copy their ID then paste it below!",
        input: "text",
        inputLabel: "Friend ID",
        closeOnCancel: true,
        inputValidator: (value) => {
          if (!value) {
            return "You need to input a valid ID";
          }
        },
        preConfirm: async (friendID) => {
          let req = await this.Chatty.Rest.getModule("user").addFriend(
            JSON.parse(await this.Chatty.AuthManager.grabLogin()).auth,
            friendID
          );
          if (!req.ok) {
            if (req.status == 408) {
              return this.$swal.showValidationMessage(
                `<div class="fc f ta">User couldn't be friended: <b class="dc"> ${req.err} (${req.status})</b></div>`
              );
            }
            return this.$swal.showValidationMessage(
              `<div class="fc f ta">User couldn't be friended: <b class="dc"> ${req.json.reason} (${req.status})</b></div>`
            );
          }
        },
      });
      if (friendID != undefined || friendID != null) {
        await this.$swal.fire({
          icon: "success",
          title: "Succesfully added!",
          html: "Friendship is pending, they'll have to friend you back",
          confirmButtonText: "YAY",
          confirmButtonColor: "var(--confirm)",
        });
      }
    },
  },
};
</script>

<style scoped>
:root {
  --timing: 80ms;
}
.options img:hover {
  padding: 4px;
  height: 32px;
  width: 32px;
  background: #4b4b4b;
  border-radius: 16px;
}
.options img {
  padding: 4px;
  height: 32px;
  width: 32px;
  background: #4b4b4b;
  border-radius: 50%;
}
.options {
  margin-top: 8px;
  margin-left: 3px;
  /* background:#747474; */
  transition: all 50ms linear;
}
.pending-img {
  width: 22px;
  height: 22px;
  margin-bottom: 11px;
  position: absolute;
  left: -3px;
  bottom: -14px;
}
.pending {
  position: absolute;
  background: #242424;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  left: 18px;
  border: #242424 4px solid;
  top: 23px;
}
.pending span {
  margin-bottom: 2px;
  font-size: 16px;
}
.home-btn {
  border-radius: 0 !important;
}
.friend-btn {
  border-radius: 0 !important;
  margin-bottom: auto !important;
  width: 42px !important;
  height: 42px !important;
  transition: all 250ms ease;
}
.friend-btn:hover {
  padding: 2px;
}
.serverbutton {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  background-color: none;
  cursor: pointer;
  position: relative;
  transition: all ease-out 0.2s;
}
.server-icon {
  width: 50px;
  height: 50px;
  color: #fff;
  border-radius: 50%;
  transition: all ease-out 0.2s;
}
.pend {
  opacity: 0.6;
}
.server-icon-ac:hover {
  border-radius: 16px;
}
.serverbutton.active,
.serverbutton:hover {
  border-radius: 16px;
}
.serverbutton .mentions {
  background-color: var(--notification);
  width: auto;
  height: 24px;
  padding: 0 4px;
  position: absolute;
  bottom: -4px;
  right: -4px;
  border-radius: 12px;
  border: solid 4px var(--quaternary);
  text-align: right;
  font-size: 13px;
  font-weight: bold;
  color: var(--nqw);
}
.serverbutton-isHome {
  background-color: var(--rocketseat);
}
.serverbutton-isHome.active,
.serverbutton-isHome:hover {
  border-radius: 16px;
  background-color: var(--rocketseat);
}
.serverbutton-hasNotification::before {
  width: 9px;
  height: 9px;
  background-color: var(--nqw);
  position: absolute;
  left: -17px;
  top: calc(50% - 4.5px);
  border-radius: 50%;
  content: "";
  display: block;
}
.item-pill {
  width: 8px;
  height: 8px;
  border-radius: 0 4px 4px 0;
  margin-left: -4px;
  background-color: var(--nqw);
  transition: all 250ms ease;
}
.slide-enter-active {
  -moz-transition-duration: 80ms;
  -webkit-transition-duration: 80ms;
  -o-transition-duration: 80ms;
  transition-duration: 80ms;
  -moz-transition-timing-function: ease-in;
  -webkit-transition-timing-function: ease-in;
  -o-transition-timing-function: ease-in;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  -moz-transition-duration: 80ms;
  -webkit-transition-duration: 80ms;
  -o-transition-duration: 80ms;
  transition-duration: 80ms;
  -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 100px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
