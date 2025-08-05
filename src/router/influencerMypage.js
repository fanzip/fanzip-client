import InfluencerMyPage from '@/pages/influencerMypage/InfluencerMypage.vue'
import ProfilePage from '@/pages/influencerMypage/ProfilePage.vue'
import EditNamePage from '@/pages/influencerMypage/EditNamePage.vue'
import EditCategoryPage from '@/pages/influencerMypage/EditCategoryPage.vue'
import EditIntroPage from '@/pages/influencerMypage/EditIntroPage.vue'
import EditProfileImagePage from '@/pages/influencerMypage/EditProfileImagePage.vue'
import EditFanCardPage from '@/pages/influencerMypage/EditFanCardPage.vue'

export default [
  {
    path: '/influencer-mypage',
    name: 'influencer-mypage',
    component: InfluencerMyPage,
  },
  {
    path: '/influencer/profile',
    name: 'InfluencerProfile',
    component: ProfilePage,
  },
  {
    path: '/influencer/profile/edit-name',
    name: 'EditName',
    component: EditNamePage,
  },
  {
    path: '/influencer/profile/edit-category',
    name: 'EditCategory',
    component: EditCategoryPage,
  },
  {
    path: '/influencer/profile/edit-intro',
    name: 'EditIntro',
    component: EditIntroPage,
  },
  {
    path: '/influencer/profile/edit-image',
    name: 'EditProfile',
    component: EditProfileImagePage,
  },
  {
    path: '/influencer/profile/edit-fancard',
    name: 'EditFanCard',
    component: EditFanCardPage,
  },
]
