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

const mapDetail = (raw) => {
  const d = raw?.data ?? raw

  return {
    meetingId: d.meetingId ?? d.meeting_id,
    title: d.title,
    description: d.description,
    venueName: d.venueName ?? d.venue_name,
    venueAddress: d.venueAddress ?? d.venue_address,
    date: d.meetingDate ?? d.meeting_date,
    venue: d.venueName ?? d.venue_name,
    influencerName: d.influencerName ?? d.influencer_name ?? '',
    profileImageUrl: d.profileImageUrl ?? d.profile_image_url ?? '',
    posterImageUrl: d.posterImageUrl ?? d.poster_image_url ?? '',
    initial: (d.influencerName ?? d.influencer_name ?? 'F').charAt(0),
    bgColor: 'from-brand-primary to-brand-accent',
  }
}
onMounted(async () => {
  try {
    const res = await getFanMeetingDetail(fanMeetingId)
    fanMeetingData.value = mapDetail(res)
    console.log('detail (mapped):', fanMeetingData.value)
  } catch (e) {
    console.error('팬미팅 상세 조회 실패:', e)
  }
})

const goToSeatSelection = () => {
  router.push(`/reservation/${fanMeetingId}/seat`)
}
</script>

<template>
  <div class="w-full min-h-screen bg-base-bg">
    <AppHeader type="back-title" title="" />

    <div class="w-full max-w-[393px] md:max-w-[430px] mx-auto">
      <FanMeetingProfile :meetingId="fanMeetingId" :data="fanMeetingData" />
      <FanMeetingPoster  :meetingId="fanMeetingId" :data="fanMeetingData" />
    </div>

    <BottomButton @click="goToSeatSelection" variant="primary" size="lg">예매하기</BottomButton>
    <div class="h-40"></div>
  </div>
</template>
