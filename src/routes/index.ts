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
    component: () => import('@pages/admin/AdminHome.vue')
  },
  {
    path: '/admin/animes/update/:uuid',
    component: () => import('@pages/admin/animes/UpdateAnime.vue')
  },
  {
    path: '/admin/animes/new',
    component: () => import('@pages/admin/animes/CreateAnime.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
