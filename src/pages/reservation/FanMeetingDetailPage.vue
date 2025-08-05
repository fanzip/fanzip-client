<template>
  <div class="w-full min-h-screen bg-base-bg">
    <AppHeader type="back-title" title="" />

    <div class="w-full max-w-[393px] md:max-w-[430px] mx-auto">
      <FanMeetingProfile
        :meetingId="fanMeetingId"
        :data="fanMeetingData"
        image="@/assets/icons/yeodano.svg"
      />
      <FanMeetingPoster
        :meetingId="fanMeetingId"
        :data="fanMeetingData"
        image="@/assets/icons/poster.svg"
      />
    </div>

    <BottomButton @click="goToSeatSelection" variant="primary" size="lg">예매하기</BottomButton>
    <div class="h-40"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomButton from '@/components/common/ButtonNav.vue'

import FanMeetingProfile from '@/components/fanmeeting/detail/FanMeetingProfile.vue'
import FanMeetingPoster from '@/components/fanmeeting/detail/FanMeetingPoster.vue'
import { getFanMeetingDetail } from '@/api/fanMeetingApi'

const route = useRoute()
const router = useRouter()
const fanMeetingId = Number(route.params.id)

const fanMeetingData = ref({})

onMounted(async () => {
  try {
    const res = await getFanMeetingDetail(fanMeetingId)
    fanMeetingData.value = res
  } catch (e) {
    console.error('팬미팅 상세 조회 실패:', e)
  }
})

const goToSeatSelection = () => {
  router.push(`/reservation/${fanMeetingId}/seat`)
}
</script>
