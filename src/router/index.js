import { createRouter, createWebHistory } from 'vue-router'
import DesignGuidePage from '@/pages/DesignGuidePage.vue'
import { reservationRoutes } from './reservation.js'

import HomePage from '@/pages/HomePage.vue'
import FanCardPage from '@/pages/fancard/FanCardPage.vue'
import MarketPage from '@/pages/market/MarketPage.vue'
import MyPage from '@/pages/mypage/MyPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // 항상 맨 위로 스크롤
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/fancard', name: 'fancard', component: FanCardPage },
    { path: '/market', name: 'market', component: MarketPage },
    { path: '/mypage', name: 'mypage', component: MyPage },

    {
      path: '/guide',
      name: 'Guide',
      component: DesignGuidePage, // 👈 여기 추가
    },

    // 예약 관련 라우트들
    ...reservationRoutes,

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
  ],
})

export default router
