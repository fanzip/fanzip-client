import FanMeetingPage from '@/pages/FanMeetingPage.vue'
import FanMeetingDetailPage from '@/pages/FanMeetingDetailPage.vue'
import SeatSelectPage from '@/pages/SeatSelectPage.vue'
import FanMeetingPaymentPage from '@/pages/FanMeetingPaymentPage.vue'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage.vue'

export const reservationRoutes = [
  { path: '/reservation', name: 'reservation', component: FanMeetingPage },
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
]