import LoginPage from '@/pages/auth/LoginPage.vue'
import AdditionalInfoPage from '@/pages/auth/AdditionalInfoPage.vue'
import LoginCallbackPage from '@/pages/auth/LoginCallbackPage.vue'

export default [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/signup/additional-info',
    name: 'AdditionalInfo',
    component: AdditionalInfoPage,
  },
  {
    path: '/oauth/kakao/callback',
    name: 'LoginCallback',
    component: LoginCallbackPage,
  },
]
