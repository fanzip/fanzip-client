import { createRouter, createWebHistory } from 'vue-router'
import DesignGuidePage from '@/pages/DesignGuidePage.vue'
import FanCardPage from '@/pages/fancard/FanCardPage.vue'
import MarketPage from '@/pages/market/MarketPage.vue'
import MyPage from '@/pages/mypage/MyPage.vue'
import FanMeetingDetailPage from '@/pages/reservation/FanMeetingDetailPage.vue'
import InfluencerListPage from '@/pages/InfluencerListPage.vue'
import influencerMypage from './influencerMypage'
// import FanMeetingDetailPage from '@/pages/FanMeetingDetailPage.vue'
import UserOnboarding from '@/pages/UserOnboarding.vue'
import InfluencerOnboarding from '@/pages/InfluencerOnboarding.vue'
import InfluencerReviewPage from '@/pages/InfluencerReviewPage.vue'
import ReviewCompletePage from '@/pages/ReviewCompletePage.vue' // 아래 선택 페이지
import AdminReviewPage from '@/pages/AdminReviewPage.vue'
import ReviewPendingPage from '@/pages/ReviewPendingPage.vue'
import NewAdminPage from '@/pages/NewAdminPage.vue'

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
  { path: '/onboarding/user', name: 'UserOnboarding', component: UserOnboarding },
  { path: '/onboarding/influencer', name: 'InfluencerOnboarding', component: InfluencerOnboarding },
  { path: '/market', name: 'market', component: MarketPage },
  { path: '/mypage', name: 'mypage', component: MyPage },
  { path: '/reservation/:id', name: 'FanMeetingDetail', component: FanMeetingDetailPage },
  { path: '/influencer/review', name: 'InfluencerReview', component: InfluencerReviewPage },
  { path: '/review/complete', component: ReviewCompletePage }, // 선택
  { path: '/admin/reviews', component: AdminReviewPage },
  { path: '/admin/new', component: NewAdminPage },
  { path: '/review/pending', component: ReviewPendingPage },

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

// 로그인 상태에 따른 라우팅 가드
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access-token')
  
  // 루트 경로에 접근할 때 로그인 상태 확인
  if (to.path === '/') {
    if (token) {
      // 로그인되어 있으면 홈페이지로 이동 허용
      next()
    } else {
      // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
      next('/login')
    }
  } else {
    // 다른 경로는 기존대로 처리
    next()
  }
})

export default router
