import LoginPage from '@/pages/auth/LoginPage.vue'
import AdditionalInfoPage from '@/pages/auth/AdditionalInfoPage.vue'
import LoginCallbackPage from '@/pages/auth/LoginCallbackPage.vue'
import UserOnboarding from '@/pages/auth/UserOnboarding.vue'
import { comma } from 'postcss/lib/list'
import InfluencerOnboarding from '@/pages/auth/InfluencerOnboarding.vue'

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
  {
    path: '/onboarding/user',
    name: 'UserOnBoarding',
    component: UserOnboarding,
  },
  {
    path: '/onboarding/influencer',
    name: 'InfluencerOnBoarding',
    component: InfluencerOnboarding,
  },
]
