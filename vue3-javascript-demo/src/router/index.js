import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'lobby',
    redirect: '/lobby',
    component: () => import(/* webpackChunkName: "Lobby" */ '../App.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLogin = false
  if (isLogin && to.name.meta.login) {
    next({ name: 'login' })
  } else {
    next()
  }
})
export default router
