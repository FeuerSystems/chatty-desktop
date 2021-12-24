<template>
  <div style="width: 100%; height: 100%" class="comp">
      <transition name="fade">
    <div class="coming-soon center fc" v-if="showable" v-tooltip="'Coming Soon!'">
      <BaseButton text="Click to hide" v-on:clicked="showable = false"/>
    </div>
    </transition>
  </div>
</template>

<script>
import BaseButton from "./BaseButton.vue";
export default { 
    components: { BaseButton },
    data() {
        return {
            showable: true
        }
    } 


};

</script>

<style scoped>
.coming-soon {
  width: 100%;
  height: 100%;
  background-color: var(--offline);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  font-size: large;
  color: white;
  font-family: var(--oxy);
  border: var(--danger) 1px solid;
 
  transition: all 250ms ease-in-out;
}
</style>
