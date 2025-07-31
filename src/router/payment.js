import PaymentPage from '@/pages/payment/PaymentPage.vue'
import PaymentSuccess from '@/pages/payment/PaymentSuccess.vue'
import PaymentFail from '@/pages/payment/PaymentFail.vue'

export default [
  {
    path: '/payments/request',
    name: 'PaymentPage',
    component: PaymentPage,
  },
  {
    path: '/payments/success',
    name: 'PaymentSuccess',
    component: PaymentSuccess,
  },
  {
    path: '/payments/fail',
    name: 'PaymentFail',
    component: PaymentFail,
  },
]