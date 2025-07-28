import FanMeetingPage from '@/pages/FanMeetingPage.vue'
import FanMeetingDetailPage from '@/pages/FanMeetingDetailPage.vue'
import SeatSelectPage from '@/pages/SeatSelectPage.vue'
import FanMeetingPaymentPage from '@/pages/FanMeetingPaymentPage.vue'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage.vue'
import SeatSelectPage from '@/pages/SeatSelectPage.vue'
import FanMeetingPaymentPage from '@/pages/FanMeetingPaymentPage.vue'
import PaymentSuccessPage from '@/pages/PaymentSuccessPage.vue'

export default [
  { path: '/reservation', name: 'reservation', component: FanMeetingPage },
  { path: '/reservation/:id', name: 'FanMeetingDetail', component: FanMeetingDetailPage },
  { path: '/seat-select/:id', name: 'SeatSelect', component: SeatSelectPage },
  { path: '/payment/:id', name: 'Payment', component: FanMeetingPaymentPage },
  { path: '/payment-success', name: 'PaymentSuccess', component: PaymentSuccessPage },
]
