import { token } from '@api/token.interface'
import decode from 'jwt-decode'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()

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
        status: 'error',
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

  if (to.query.status) {
    if (to.query.status === 'error') {
      setTimeout(() => toast.error(to.query.message as string), 500)
    }
    if (to.query.status === 'success') {
      setTimeout(() => toast.success(to.query.message as string), 500)
    }
    if (to.query.status === 'default') {
      setTimeout(() => toast(to.query.message as string), 500)
    }
    router.push({
      path: to.path, params: to.params, query: { ...to.query, status: undefined, message: undefined }
    })
  } else {
    next()
  }
})

function hasValidToken () {
  const token = localStorage.getItem('token')
  if (!token) return false

  const decoded: token = decode(token)
  const isExpired = Date.now() >= decoded.exp * 1000

  if (isExpired) {
    localStorage.removeItem('token')
    return false
  }

  return true
}

function isAdmin () {
  const token = localStorage.getItem('token')
  const decoded: token = decode(token as string)
  if (decoded.isAdmin) return true
  return false
}
