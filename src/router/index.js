import { createRouter, createWebHistory } from 'vue-router'
import DesignGuidePage from '@/pages/DesignGuidePage.vue'
// import MarketPage from '@/pages/MarketPage.vue'
// import MyPage from '@/pages/MyPage.vue'
// import FanCardPage from '@/pages/FanCardPage.vue'
// import FanMeetingPage from '@/pages/FanMeetingPage.vue'
import HomePage from '@/pages/HomePage.vue'
import FanMeetingDetailPage from '@/pages/FanMeetingDetailPage.vue'
import MembershipSelect from '@/pages/MembershipSelect.vue'

import authRoutes from './auth'
import fanMeetingRoutes from './fanMeeting'
import membershipRoutes from './membership'
import marketRoutes from './market'
import mypageRoutes from './mypage'
import cartRoutes from './cart'

import fanCardRoutes from './fanCard'
const routes = [
  // 기본 라우트
  { path: '/', name: 'home', component: HomePage },
  { path: '/guide', name: 'Guide', component: DesignGuidePage },
  { path: '/membership/select', name: 'MembershipSelect', component: MembershipSelect },
  { path: '/reservation/:id', name: 'FanMeetingDetail', component: FanMeetingDetailPage },

  // 도메인 라우트
  ...authRoutes,
  ...fanMeetingRoutes,
  ...membershipRoutes,
  ...fanCardRoutes,
  ...marketRoutes,
  ...mypageRoutes,
  ...cartRoutes,
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
