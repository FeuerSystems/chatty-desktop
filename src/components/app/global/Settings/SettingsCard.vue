<template>
    <div class="settings-card feature-comp adjust" :group="group">
        <img height="32px" width="fit-content" :src="icon" :id="group + '-img'" ref="group-img" :class="`settings-card-img ${circle ? 'circle' : ''}`" @click="(e) => {(circle) ? copyAvatar(e) : null}" :copy="circle"/>
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
    },
    methods: {
        copyAvatar(e) {
            let el = e.srcElement;
            console.log(el);
            this.$clipboard(el.src);

        }
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
  transition: all 100ms ease;
  border: var(--primary-clicked) 1px solid;
}
.feature-comp:hover {
    border: var(--primary) 2px solid;
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
    opacity: 0.8;
    transition: all 100ms ease-in-out;
}
.settings-card-img:hover[copy] {
  cursor: copy;
  opacity: 1;
}
.circle {
    border-radius: 50%;
}
</style>