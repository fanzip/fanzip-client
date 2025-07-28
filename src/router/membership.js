import FanCardPage from '@/pages/FanCardPage.vue'
export default [
  { path: '/fancard', name: 'fancard', component: FanCardPage },
  {
    path: '/fancard/detail/:id',
    name: 'FanCardDetailPage',
    component: () => import('@/pages/FanCardDetailPage.vue'),
  },
]
