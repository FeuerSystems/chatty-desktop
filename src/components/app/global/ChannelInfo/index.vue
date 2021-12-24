<template>
  <transition name="fade">
    <div class="channelbar" v-if="channelData">
      <div class="innerbar fr" :id="`channel-${channelData.id}`">
        <img
          :src="
            channelData.avatar == null
              ? require('@/assets/svg/icons/missing.svg')
              : channelData.avatar
          "
          width="45"
          height="45"
          class="channel-icon rounded"
        />
        <span class="channel-data"
          ><span class="descriptor"><img :src="require('@/assets/svg/icons/at.svg')" height="32px" width="32px" class="dimg"></span><span class="channel-name">{{ channelData.name }}</span>
          <span class="channel-id">({{ channelData.id }})</span></span
        >
        <BaseButton :icon="require('@/assets/svg/icons/call.svg')" v-on:clicked="call" text="Call" :disabled="true" v-tooltip="'This is for developers only!'" type="primary"/>
      </div>
    </div>
  </transition>
</template>

<script>
import BaseButton from "@/components/base/BaseButton";
import { invoke } from "@tauri-apps/api/tauri";
import { timer } from "../../../../buildpack/Core/Utils/GenericUtils";
import VoiceSocket from "../../../../buildpack/Voice/VoiceSocket";

async function handleNegotion(peer) {
  console.log("hurr durr");
}

export default {
  name: "channel-info",
  components: { BaseButton },
  computed: {
    channelData() {
      return this.$store.state.currentChannel;
    },
  },
  mounted() {},
  methods: {
    async call(e) {
      let ctx = this;
      let voice = new VoiceSocket("wss://rtc.feuer.tech");
      await voice.start();
      voice.login(this.$store.state.self.auth);
      voice.getStream();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      timer();
      const peer = createPeer();
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      function createPeer() {
        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: "stun:stun.stunprotocol.org",
            },
          ],
        });
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

        return peer;
      }

      async function handleNegotiationNeededEvent(peer) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
          type: 2,
          d: {
            server: ctx.$store.state.currentChannel.id,
            user: ctx.$store.state.self.id,
            session: "hurr durr",
            sdp: peer.localDescription,
          },
        };
       voice.sendRTC(payload);
       voice.events.on('sfudispatch', (json) => {
        console.log(timer("CREATE_RTC"));
        const desc = new RTCSessionDescription(json.rtc);
        console.log(desc);
        peer.setRemoteDescription(desc).catch((e) => console.log(e));
        console.log(peer)
       });
       
      }
      let inputs = await invoke("list_inputs");

      //   voice.startHeartbeat();
      //   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      //  document.getElementById("ur-mother").srcObject = stream;
      //   const peer = new RTCPeerConnection({
      //     iceServers: [
      //       {
      //         urls: "stun:stun.stunprotocol.org",
      //       },
      //     ],
      //   });
      //   console.log(peer);
      //   peer.ondatachannel = () => {console.log('Data channel created!')}
      //   peer.onnegotiationneeded = (e) => {
      //       console.log(e);
      //   };
    },
  },
};
</script>

<style scoped>
.innerbar {
<<<<<<< HEAD
  padding: 5px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 7px;
=======
    background: rgb(34, 34, 34);
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    width: fit-content;
    border: var(--confirm) 2px solid;
    padding: 7px;
>>>>>>> parent of 6206ad8 (Add a bit more of everything including upload progress for Avatar (GIFS))
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
.descriptor {
  vertical-align: middle;
  opacity: .8;
  padding-right: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.dimg {
  fill: white;
  opacity: .8;
  padding-right: 5px;
  margin-bottom: 3px;
}
</style>
