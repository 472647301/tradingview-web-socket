import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Trader from '@/views/trader'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/trader',
      name: 'trader',
      component: Trader
    }
  ]
})
