import { createRouter, createWebHistory } from 'vue-router'
import DesignGuidePage from '@/pages/DesignGuidePage.vue'
import MarketPage from '@/pages/MarketPage.vue'
import MyPage from '@/pages/MyPage.vue'
import FanCardPage from '@/pages/FanCardPage.vue'
import FanMeetingPage from '@/pages/FanMeetingPage.vue'
import HomePage from '@/pages/HomePage.vue'
import FanMeetingDetailPage from '@/pages/FanMeetingDetailPage.vue'
import SeatSelectPage from '@/pages/SeatSelectPage.vue'
import FanMeetingPaymentPage from '@/pages/FanMeetingPaymentPage.vue'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage.vue'

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
      path: '/fan-meeting/:id',
      name: 'FanMeetingDetail',
      component: FanMeetingDetailPage
    },
    {
      path: '/seat-select/:id',
      name: 'SeatSelect',
      component: SeatSelectPage
    },
    {
      path: '/payment/:id',
      name: 'Payment',
      component: FanMeetingPaymentPage
    },
    {
      path: '/payment-success',
      name: 'PaymentSuccess',
      component: PaymentSuccessPage
    },
    // 아래는 테스트용이라 추후 삭제 예정
    {
      path: '/reservation/detail',
      name: 'FanMeetingDetailOld',
      component: FanMeetingDetailPage
    }
    
    
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
