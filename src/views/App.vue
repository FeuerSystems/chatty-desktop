<template>
  <div id="app-container">
      <ServerList id="server-list"/>
      <selfpanel :status="{ text: 'haha', img: 'https://chatty-api.feuer.tech/609593521631408188230/370959481632061758269.jpg' }" name="Brys" avatar="https://chatty-api.feuer.tech/609593521631408188230/370959481632061758269.jpg" id="-1" class="selfuser" />
  </div>
</template>

<script>
import selfpanel from '../components/app/global/selfpanel';
import ServerList from '../components/app/global/ServerList';
export default {
    name: 'app',
    components: {ServerList, selfpanel}
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
