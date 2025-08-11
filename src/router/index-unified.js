import Vue from 'vue'
import VueRouter from 'vue-router'
import { supabase } from '@/shared/services'

Vue.use(VueRouter)
import adminRoutes from '@/modules/admin/routes'
import portfolioRoutes from '@/modules/portfolio/routes'
import welcomeRoutes from '@/modules/welcome/routes'

// 모든 라우트 통합
const routes = [
  ...welcomeRoutes,
  ...adminRoutes,
  ...portfolioRoutes,
  // 404 페이지
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/shared/components/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  // 인증이 필요한 페이지
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
  // 게스트만 접근 가능한 페이지
  else if (to.matched.some(record => record.meta.guest)) {
    if (user) {
      next({ name: 'AdminDashboard' })
    } else {
      next()
    }
  }
  else {
    next()
  }
})

export default router