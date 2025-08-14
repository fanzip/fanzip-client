import FanMeetingPage from '@/pages/reservation/FanMeetingPage.vue'
import FanMeetingDetailPage from '@/pages/reservation/FanMeetingDetailPage.vue'
import SeatSelectPage from '@/pages/reservation/SeatSelectPage.vue'
import FanMeetingPaymentPage from '@/pages/reservation/FanMeetingPaymentPage.vue'
import PaymentSuccessPage from '@/pages/payment/PaymentSuccess.vue'
import FanmeetingCreatePage from '@/pages/influencerMypage/FanmeetingCreatePage.vue'

export default [
  { path: '/reservation', name: 'reservation', component: FanMeetingPage },
  { path: '/reservation/:id', name: 'FanMeetingDetail', component: FanMeetingDetailPage },
  { path: '/seat-select/:id', name: 'SeatSelect', component: SeatSelectPage },
  { path: '/payment/:id', name: 'FanMeetingPaymentPage', component: FanMeetingPaymentPage },
  { path: '/payment-success', name: 'PaymentSuccess', component: PaymentSuccessPage },

  {
    path: '/influencers/:influencerId/fanmeetings/create',
    name: 'FanmeetingCreate',
    component: FanmeetingCreatePage,
    props: true, // 원하면 컴포넌트에서 props로 받을 수 있게
  },
  // {
  //   path: '/fanmeeting/new',
  //   redirect: (to) => ({ name: 'FanmeetingCreate', params: { influencerId: '' } }),
  // },
]
