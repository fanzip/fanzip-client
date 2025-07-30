import MyAccount from '@/pages/mypage/MyAccount.vue'
import MyPage from '@/pages/mypage/MyPage.vue'
import MyPayments from '@/pages/mypage/MyPayments.vue'
import MyShippingAddress from '@/pages/mypage/MyShippingAddress.vue'
export default [
  { path: '/mypage', name: 'mypage', component: MyPage },
  { path: '/account', name: 'account', component: MyAccount },
  { path: '/shipping', name: 'shipping', component: MyShippingAddress },
  { path: '/my-payments', name: 'myPayments', component: MyPayments },
]
