import FanMeetingPage from '@/pages/reservation/FanMeetingPage.vue'
import FanMeetingDetailPage from '@/pages/reservation/FanMeetingDetailPage.vue'
import SeatSelectPage from '@/pages/reservation/SeatSelectPage.vue'
import FanMeetingPaymentPage from '@/pages/reservation/FanMeetingPaymentPage.vue'
import PaymentSuccessPage from '@/pages/payment/PaymentSuccess.vue'

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
    path: '/payments/success',
    name: 'PaymentSuccess',
    component: PaymentSuccessPage,
  },
]