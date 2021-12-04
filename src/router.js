import State from './components/State.vue';
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'state',
      component: State
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component:  () => import(/* webpackChunkName: "about" */ './views/LogIn')
    },
    {
      path: '/app',
      name: 'app',
      props: true,
      component: () => import('./views/App')
    },
    {
      path: '/settings',
      name: 'settings',
      props: true,
      component: () => import('./views/Settings')
    }
  ]
})
