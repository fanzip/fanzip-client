import { createRouter, createWebHistory } from 'vue-router'
import DesignGuidePage from '@/pages/DesignGuidePage.vue'
import FanCardPage from '@/pages/fancard/FanCardPage.vue'
import MarketPage from '@/pages/market/MarketPage.vue'
import MyPage from '@/pages/mypage/MyPage.vue'
import FanMeetingDetailPage from '@/pages/reservation/FanMeetingDetailPage.vue'
import InfluencerListPage from '@/pages/InfluencerListPage.vue'
import influencerMypage from './influencerMypage'
// import FanMeetingDetailPage from '@/pages/FanMeetingDetailPage.vue'

import authRoutes from './auth'
import fanMeetingRoutes from './fanMeeting'
import membershipRoutes from './membership'
import marketRoutes from './market'
import mypageRoutes from './mypage'
import cartRoutes from './cart'
import fanCardRoutes from './fanCard'
import paymentRoutes from './payment'

import { reservationRoutes } from './reservation.js'

const routes = [
  // 기본 라우트
  { path: '/', name: 'home', component: InfluencerListPage },
  { path: '/guide', name: 'Guide', component: DesignGuidePage },
  { path: '/fancard', name: 'fancard', component: FanCardPage },
  { path: '/market', name: 'market', component: MarketPage },
  { path: '/mypage', name: 'mypage', component: MyPage },
  { path: '/reservation/:id', name: 'FanMeetingDetail', component: FanMeetingDetailPage },

  // 도메인 라우트
  ...authRoutes,
  ...fanMeetingRoutes,
  ...membershipRoutes,
  ...fanCardRoutes,
  ...marketRoutes,
  ...mypageRoutes,
  ...cartRoutes,
  ...paymentRoutes,
  ...reservationRoutes,
  ...influencerMypage,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    // 페이지 이동 시 항상 맨 위로 이동
    return { top: 0 }
  },
})

export default router
