<template>
    <div id="app-server-list">
          <ServerButton isHome :server="{id: '-1'}"/>
          <div class="separator"/>
           <ServerButton v-for="server in servers" :key="server.id" :server="server"/>
          <ServerButton v-for="server in servers" :key="server.id" :server="server" pending/>

          <ServerButton :server="{id: '-111'}" friendButton/>
    </div>  
</template>

<script>
import ServerButton from './ServerButton';
export default {
    name: 'server-list',
    components: {ServerButton},
    props: {
        servers: {
            required: false,
            default: [{
                name: 'Example user',
                id: -1,
                info: 'INFO',
                avatar: 'https://chatty-api.feuer.tech/609593521631408188230/370959481632061758269.jpg'
            },
            {
                name: 'Example user',
                id: -11,
                info: 'INFO',
                avatar: 'https://chatty-api.feuer.tech/609593521631408188230/370959481632061758269.jpg'
            }]
        }
    }
}
</script>

<style scoped>

 
.separator {
  width: 32px;
  border-bottom: solid 2px var(--primary);
  margin-bottom: 8px;
  border-radius: 15px;
}
</style>