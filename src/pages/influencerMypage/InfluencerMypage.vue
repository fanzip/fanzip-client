<script setup>
import InfluencerProfile from '@/components/influencerMypage/InfluencerProfile.vue'
import StatisticsSummary from '@/components/influencerMypage/statistics/StatisticsSummary.vue'
import Statistics from '@/components/influencerMypage/statistics/Statistics.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import ReportAlert from '@/components/influencerMypage/statistics/ReportAlert.vue'
import InfluencerMenu from '@/components/influencerMypage/menu/InfluencerMenu.vue'
import { getInfluencerMyProfile } from '@/api/influencerApi'
import { getFanMeetings } from '@/api/fanMeetingApi'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const latestMeetingId = ref(null)

onMounted(async () => {
  // 데이터가 없을 때만 API 호출
  if (!authStore.influencerUserInfo.influencerName) {
    try {
      const data = await getInfluencerMyProfile()
      authStore.setinfluencerUserInfo(data)
    } catch (e) {
      console.error(e)
    }
  }

  // 최신 팬미팅 ID 가져오기
  try {
    const fanMeetings = await getFanMeetings()
    if (fanMeetings && fanMeetings.length > 0) {
      const currentInfluencerName = authStore.influencerUserInfo.influencerName
      const influencerMeetings = fanMeetings.filter(meeting => 
        meeting.title?.includes(currentInfluencerName)
      )
      
      if (influencerMeetings.length > 0) {
        latestMeetingId.value = influencerMeetings[influencerMeetings.length - 1].meetingId
      } else {
        latestMeetingId.value = fanMeetings[0].meetingId
      }
    }
  } catch (e) {
    console.error('팬미팅 목록 조회 실패:', e)
    latestMeetingId.value = 15 // 김승원빈 팬미팅 ID
  }
})
</script>

<template>
  <AppHeader type="logo" />
  <div class="overflow-hidden p-5 pb-20 min-h-screen bg-subtle-bg space-y-4">
    <InfluencerProfile />
    <StatisticsSummary />
    <Statistics />
    <ReportAlert :meetingId="latestMeetingId" />
    <InfluencerMenu />
    <!-- 컴포넌트 넣기 -->
    <div class="bg-subtle-bg py-3">
      <div class="text-xs flex gap-5">
        <p>이용약관</p>
        <p>개인정보 처리방침</p>
      </div>
      <div class="text-sm text-subtle-text mt-6 mb-0">
        <p>COPYRIGHT © (주)좋은데요</p>
        <p>ALL RIGHTS RESERVED.</p>
      </div>
    </div>
    <AppNav />
  </div>
</template>
