import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@components/HelloWorld.vue')
  },
  {
    path: '/login',
    component: () => import('@pages/Login.vue')
  },
  {
    path: '/admin',
    component: () => import('@pages/home/AdminHome.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
