import FanMeetingPage from '@/pages/FanMeetingPage.vue'
import FanMeetingDetailPage from '@/pages/FanMeetingDetailPage.vue'
import SeatSelectPage from '@/pages/SeatSelectPage.vue'
import FanMeetingPaymentPage from '@/pages/FanMeetingPaymentPage.vue'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage.vue'

export default [
  { path: '/reservation', name: 'reservation', component: FanMeetingPage },
  { path: '/reservation/:id', name: 'FanMeetingDetail', component: FanMeetingDetailPage, meta: { hideNavbar: true } },
  { path: '/reservation/:id/seat', name: 'SeatSelect', component: SeatSelectPage, meta: { hideNavbar: true } },
  { path: '/reservation/:id/payment', name: 'FanMeetingPayment', component: FanMeetingPaymentPage, meta: { hideNavbar: true } },
  { path: '/payment/success', name: 'PaymentSuccess', component: PaymentSuccessPage, meta: { hideNavbar: true } },
]
