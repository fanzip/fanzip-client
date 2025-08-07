import InfluencerMyPage from '@/pages/influencerMypage/InfluencerMypage.vue'
import ProfilePage from '@/pages/influencerMypage/ProfilePage.vue'
import EditNamePage from '@/pages/influencerMypage/EditNamePage.vue'
import EditCategoryPage from '@/pages/influencerMypage/EditCategoryPage.vue'
import EditIntroPage from '@/pages/influencerMypage/EditIntroPage.vue'
import EditFanCardPage from '@/pages/influencerMypage/EditFanCardPage.vue'

export default [
  {
    path: '/influencers-mypage',
    name: 'influencers-mypage',
    component: InfluencerMyPage,
  },
  {
    path: '/influencers/:influencerId/profile',
    name: 'InfluencerProfile',
    component: ProfilePage,
  },
  {
    path: '/influencers/:influencerId/profile/edit-name',
    name: 'EditName',
    component: EditNamePage,
  },
  {
    path: '/influencers/:influencerId/profile/edit-category',
    name: 'EditCategory',
    component: EditCategoryPage,
  },
  {
    path: '/influencers/:influencerId/profile/edit-intro',
    name: 'EditIntro',
    component: EditIntroPage,
  },
  {
    path: '/influencers/:influencerId/profile/edit-fancard',
    name: 'EditFanCard',
    component: EditFanCardPage,
  },
]
