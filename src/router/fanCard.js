import FanCardPage from '@/pages/fancard/FanCardPage.vue'
import MobileTicketPage from '@/pages/fancard/MobileTicketPage.vue'

export default [
  { path: '/fancard', name: 'fancard', component: FanCardPage },
  {
    path: '/fancard/detail/:id',
    name: 'FanCardDetailPage',
    component: () => import('@/pages/fancard/FanCardDetailPage.vue'),
  },
  {
    path: '/fancard/mobile-ticket',
    name: 'MobileTicketPage',
    component: MobileTicketPage,
    meta: { hideNavbar: true },
  },
  {
    path: '/fancard/mobile-ticket/:reservationId/:seatId/:meetingId',
    name: 'UniqueMobileTicketPage',
    component: MobileTicketPage,
    meta: { hideNavbar: true },
  },
  {
    path: '/fancard/qr-validation',
    name: 'QRValidationPage',
    component: () => import('@/pages/fancard/QRValidationPage.vue'),
  },
]
