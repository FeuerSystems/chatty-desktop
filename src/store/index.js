import Vue from "vue";
import Vuex from "vuex";
import "./proto";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    friends: [
      {
        name: "Friends are loading...",
        id: 0,
        info: "Friends are loading...",
        avatar: require("../assets/svg/icons/loading.svg"),
        pending: false,
      },
    ],
    servers: [],
    self: { name: null },
  },
  mutations: {
    ADD_USER(state, user) {
      user.pending = user.p;
      user.p = null;
      state.friends.push(user);
    },
    REMOVE_USER(state, user) {
      let i = state.friends.map(item => item.id).indexOf(user) // find index of your object
      state.friends.splice(i, 1)
    },
    SET_USERS(state, users) {
      state.friends = users;
    },
    SET_SELF(state, self) {
      state.self = self;
    },
  },
  actions: {
    async setSelf({commit}, payload) {
      commit("SET_SELF", payload);
    },
    async addFriend({ commit }, payload) {
      commit("ADD_USER", payload);
    },
    async removeFriend({ commit }, payload) {
      commit("REMOVE_USER", payload);
    },
    async setFriends({ commit }, payload) {
      payload.pending.forEach((element) => {
        commit("ADD_USER", {
          id: element.id,
          info: element.name,
          name: element.name,
          avatar: element.avatar,
          p: true,
        });
      });
      payload.friends.forEach((element) => {
        commit("ADD_USER", {
          id: element.id,
          info: element.name,
          name: element.name,
          avatar: element.avatar,
          p: false,
        });
      });
    },
  },
  modules: {},
  getters: {
    friends: (state) => {
      return state.friends;
    },
  },
});
