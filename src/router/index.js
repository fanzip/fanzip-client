import { createRouter, createWebHistory } from 'vue-router'
import DesignGuidePage from '@/pages/DesignGuidePage.vue'

import HomePage from '@/pages/HomePage.vue'

import authRoutes from './auth'
import fanMeetingRoutes from './fanMeeting'
import membershipRoutes from './membership'
import marketRoutes from './market'
import mypageRoutes from './mypage'
const routes = [
  // 기본 라우트
  { path: '/', name: 'home', component: HomePage },
  { path: '/guide', name: 'Guide', component: DesignGuidePage },

  // 도메인 라우트
  ...authRoutes,
  ...fanMeetingRoutes,
  ...membershipRoutes,
  ...marketRoutes,
  ...mypageRoutes,
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView,
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (About.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import('../views/AboutView.vue'),
  // },
})

export default router
