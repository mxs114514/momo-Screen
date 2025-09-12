import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type {RouteRecordRaw} from "vue-router"
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    children:[
      {
        path: '/index',
        name: 'index',
        component: () => import('@/views/index/index.vue'),
      },
      {
        path: '/analysis',
        name: 'analysis',
        component: () => import('@/views/analysis/index.vue'),
      },
      {
        path: '/trend',
        name: 'trend',
        component: () => import('@/views/trend/index.vue'),
      },
      {
        path: '/supervision',
        name: 'supervision',
        component: () => import('@/views/supervision/index.vue'),
      },
      {
        path: '/environmental',
        name: 'environmental',
        component: () => import('@/views/environmental/index.vue'),
      },
      {
        path: '/policy',
        name: 'policy',
        component: () => import('@/views/policy/index.vue'),
      },
      {
        path: '/report',
        name: 'report',
        component: () => import('@/views/report/index.vue'),
      }
    ]
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  if (to.path === '/login') {
    // 如果已登录，访问登录页面时重定向到首页
    if (isLoggedIn) {
      next('/index')
    } else {
      next()
    }
  } else {
    // 访问其他页面时检查登录状态
    if (isLoggedIn) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
