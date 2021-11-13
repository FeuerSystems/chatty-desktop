<template>
  <transition name="fade">
    <div class="app-login">
      <div class="login-container c fc">
        <h2 id="login" class="pc">Please, log in below</h2>
        <div class="form-container-modal">
          <div class="modal-form">
            <!-- <h2 class="header-modal-type">{{ type }} Below</h2> -->
            <div class="center">
              <div class="modal-contents center fc">
                <div class="modal-email">
                  <p class="formlbl">Email: <br /></p>
                  <input
                    type="text"
                    placeholder="Email"
                    class="forminput email"
                    @input="checkEmail"
                    v-model="email"
                    id="app-email"
                  />
                </div>
                <div class="modal-password adjust">
                  <p class="formlbl">Password: <br /></p>
                  <input
                    type="password"
                    placeholder="p455w0rd"
                    class="forminput"
                    id="app-pass"
                    @keypress="login"
                    v-model="password"
                  />
                </div>
              </div>
            </div>
            <div class="modal-actions" style="height: 32px" />
          </div>
        </div>
        <BaseButton text="Log In" :icon="icon" type="confirm" v-on:clicked="login" />
      </div>
    </div>
  </transition>
</template>

<script>
import "../assets/app.css";
import BaseButton from "@/components/base/BaseButton.vue";
import { verifyEmail } from "@/buildpack/Core/Utils/GenericUtils";
let userMod;
// Set element color to 'invalid' or red
function setInvalid(element) {
  element.style.color = "var(--danger)";
  element.style.textDecoration = "underline";
}

// Set element color to valid, or green
function setValid(element) {
  element.style.color = "var(--confirm)";
  element.style.textDecoration = "none";
}

async function sendLogin(data) {
  return await userMod.login(data.email, data.password);
}
export default {
  name: "login",
  mounted() {
    this.requireModules("rest");
    userMod = this.Chatty.Rest.getModule("user");
    this.log("Login", "Mounted to login");
  },
  components: { BaseButton },
  methods: {
    checkEmail(event) {
      let email = event.srcElement.value;
      if (!verifyEmail(email)) return setInvalid(event.srcElement);
      setValid(event.srcElement);
    },
    async login(event) {
      if (event.key != "Enter" && event.pointerId == null) return;
      if (this.password.length < 1) return setInvalid(document.getElementById("app-pass"));
      if (this.password.length > 4) {
        setValid(document.getElementById("app-pass"));
        this.log('Log In (Comp)', `Sending login req {email: "${this.email}", password: "${this.password} (sha512 encrypt, salt code 512)" }`);
        this.icon = require("../assets/svg/icons/buttonload.svg");
        let res = await sendLogin({ email: this.email, password: this.password });
        if (res.ok) {
          this.icon = require("../assets/svg/icons/check.svg");
          // Lets delay the page merge a bit, and let the user enjoy the change of the login icon
          setTimeout(async () => {
            this.Chatty.AuthManager.saveLogin(JSON.stringify(res.json), false);
            this.$router.push("app");
          }, 20);
        }
        if (!res.ok) {
          await this.$swal.fire({
            icon: "error",
            title: "Something went wrong when trying to sign in",
            confirmButtonText: ":C",
            confirmButtonColor: "var(--danger)",
            html: `<p style="color: var(--danger)">${res.json.reason}<br></p>`,
          });
          this.icon = require("../assets/svg/icons/login.svg");
        } else {
        }

        return;
      }
    },
  },
  data() {
    return {
      email: "",
      password: "",
      icon: require("../assets/svg/icons/login.svg"),
    };
  },
};
</script>

<style>
#login {
  font-family: var(--webf);
}
.login-container {
  background: #2a2a2abe;
  border-radius: 15px;
  border: var(--primary) 2px solid;
}
.header-modal-type {
  color: var(--confirm);
  font-family: var(--oxy);
}
.form-container-modal {
  padding: 20px;
  font-family: Helvetica, Arial, sans-serif;
  height: 75%;
  overflow: hidden;

  border-radius: 15px;
}

.forminput {
  font-family: var(--oxy) !important;
  font-size: 75%;
  width: 50vw;
  font-weight: 600;
  background: #222222;
  border: none;
  padding: 10px;
  transition: all 200ms linear, color 200ms linear;
  color: var(--nqw);
  opacity: 0.8;
  height: 35px;
  font-size: large;
}

.forminput:focus {
  outline: 0;
  border-bottom-color: #42b883;
  color: #42b883;
  opacity: 1;
}
.formlbl {
  color: var(--primary) !important;
  justify-content: left;
  align-items: left;
}

.modal-close {
  float: right;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.login-button {
  font-size: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
html,
body {
    font-family: var(--webf);
    background-image: url(../assets/svg/bg.svg);
}
</style>
