import { token } from '@api/token.interface'
import decode from 'jwt-decode'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@components/HelloWorld.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('@pages/Login.vue')
  },
  {
    path: '/admin',
    component: () => import('@pages/admin/AdminHome.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    },
    children: [
      {
        path: 'animes/',
        component: () => import('@pages/admin/animes/ListAnime.vue')
      },
      {
        path: 'animes/update/:uuid',
        component: () => import('@pages/admin/animes/UpdateAnime.vue')
      },
      {
        path: 'animes/new',
        component: () => import('@pages/admin/animes/CreateAnime.vue')
      }
    ]
  },
  {
    path: '/animes',
    component: () => import('@pages/anime/AnimeHome.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: ':uuid',
        component: () => import('@pages/anime/ShowAnime.vue')
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !hasValidToken()) {
    next({
      path: '/login',
      query: {
        message: 'Você deve estar logado',
        redirect: to.path
      }
    })
    return
  }
  if (to.meta.requiresAdmin && !isAdmin()) {
    next({
      path: '/',
      query: {
        message: 'Você não tem permissão',
        status: 'error'
      }
    })
    return
  }

  next()
})

function hasValidToken () {
  const token = localStorage.getItem('token')
  if (!token) return false

  const decoded: token = decode(token)
  const isExpired = Date.now() >= decoded.exp * 1000

  if (isExpired) return false

  return true
}

function isAdmin () {
  const token = localStorage.getItem('token')
  const decoded: token = decode(token as string)
  if (decoded.isAdmin) return true
  return false
}
