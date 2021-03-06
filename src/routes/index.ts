import { token } from '@api/token.interface'
import decode from 'jwt-decode'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()

const routes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@pages/NotFound.vue')
  },
  {
    path: '/login',
    component: () => import('@pages/auth/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@pages/auth/Register.vue')
  },
  {
    path: '/confirmation',
    component: () => import('@pages/auth/EmailConfirmation.vue')
  },
  {
    path: '/',
    component: () => import('@pages/Main.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/home',
        component: () => import('@pages/Home.vue')
      },
      {
        path: '/animes',
        component: () => import('@pages/anime/AnimeHome.vue')
      },
      {
        path: '/animes/:uuid',
        component: () => import('@pages/anime/ShowAnime.vue')
      },
      {
        path: '/animes/:uuid/review',
        component: () => import('@pages/anime/ReviewAnime.vue')
      },
      {
        path: 'users/:uuid',
        component: () => import('@pages/user/SingleUser.vue')
      },
      {
        name: 'UserConfig',
        path: 'users/:uuid/config',
        component: () => import('@pages/user/UserConfig.vue')
      },
      {
        path: 'reviews/:uuid/update',
        component: () => import('@pages/review/UpdateReview.vue')
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@pages/admin/AdminMain.vue'),
    meta: {
      requiresAdmin: true
    },
    children: [
      {
        path: 'home',
        component: () => import('@pages/admin/AdminHome.vue')
      },
      {
        path: 'animes',
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
  }

]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next({ path: '/home', query: to.query })
    return
  }
  if (to.path === '/admin') {
    next({ path: '/admin/home', query: to.query })
    return
  }

  if (to.meta.requiresAuth && !hasValidToken()) {
    next({
      path: '/login',
      query: {
        message: 'Voc?? deve estar logado',
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
        message: 'Voc?? n??o tem permiss??o',
        status: 'error'
      }
    })
    return
  }

  // Global toast by route query
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
    // Remove toast query params
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
