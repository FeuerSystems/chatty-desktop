<template>
    <div class="settings-card feature-comp adjust" :group="group">
        <img height="32px" width="fit-content" :src="icon" :class="`settings-card-img ${circle ? 'circle' : ''}`"/>
        <span class="settings-card-name" v-html="text"/>
        <div class="statements">
            <span v-for="(property, index)  in properties" :key="index" class="statement shift"><b class="pc">⮞</b> <span v-html="property"></span><br></span>
        </div>
    </div>
</template>


<script>
export default {
    name: 'settings-card',
    props: {
        text: String,
        icon: Object,
        circle: Boolean,
        group: String,
        properties: Array
    }
}
</script>


<style scoped>
.settings-card-name {
    font-weight: bold;
    font-size: 28px;
}
.feature-comp {
  justify-content: left;
  align-items: center;
  background: rgb(39, 39, 39);
  padding: 8px;
  border-radius: 5px;
  color: var(--nqw);
}
.adjust {
    margin-top: 15px;
}
.shift {
  margin-left: 10px;
}
.caption {
  font-size: 15px;
}
.settings-card-img {
    vertical-align: sub;
    opacity: .8;
}
.circle {
    border-radius: 50%;
}
</style>