import FanMeetingPage from '@/pages/FanMeetingPage.vue'
import FanMeetingDetailPage from '@/pages/FanMeetingDetailPage.vue'

export default [
  {
    path: '/reservation',
    name: 'reservation',
    component: FanMeetingPage,
  },
  {
    path: '/reservation/:id',
    name: 'FanMeetingDetail',
    component: FanMeetingDetailPage,
  },
  // 아래는 테스트용이라 추후 삭제 예정
  {
    path: '/reservation/detail',
    name: 'FanMeetingDetail',
    component: FanMeetingDetailPage,
  },
]
