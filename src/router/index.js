import { createRouter, createWebHistory } from 'vue-router'
import DesignGuidePage from '@/pages/DesignGuidePage.vue'
import HomePage from '@/pages/HomePage.vue'

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
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/reservation', name: 'reservation', component: FanMeetingPage },
    { path: '/fancard', name: 'fancard', component: FanCardPage },
    { path: '/market', name: 'market', component: MarketPage },
    { path: '/mypage', name: 'mypage', component: MyPage },

    {
      path: '/guide',
      name: 'Guide',
      component: DesignGuidePage, // 👈 여기 추가
    },
    {
      path: '/reservation/:id',
      name: 'FanMeetingDetail',
      component: FanMeetingDetailPage,
    },
    // 아래는 테스트용이라 추후 삭제 예정
    {
      path: '/reservation/detail',
      name: 'FanMeetingDetailTest',
      component: FanMeetingDetailPage,
    },
    {
      path: '/reservation/:id/seat',
      name: 'SeatSelect',
      component: SeatSelectPage,
    },
    {
      path: '/reservation/:id/payment',
      name: 'FanMeetingPayment',
      component: FanMeetingPaymentPage,
    },
    {
      path: '/payment/success',
      name: 'PaymentSuccess',
      component: PaymentSuccessPage,
    },

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
