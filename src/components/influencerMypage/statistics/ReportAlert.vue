<script setup>
import Report from '@/assets/InfluencerProfile/Report.svg'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { getInfluencerMyProfile } from '@/api/influencerApi'
import { ref, onMounted, watch } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

// props로 받거나 기본값 사용
const props = defineProps({
  meetingId: {
    type: Number,
    default: null
  }
})

const latestMeetingId = ref(props.meetingId || null)
const influencerId = ref(null)

// 인플루언서 ID 가져오기
onMounted(async () => {
  // authStore에서 인플루언서 정보가 없다면 가져오기
  if (!authStore.influencerUserInfo.influencerId) {
    try {
      const data = await getInfluencerMyProfile()
      authStore.setinfluencerUserInfo(data)
    } catch (e) {
      console.error('인플루언서 프로필 조회 실패:', e)
    }
  }
  influencerId.value = authStore.influencerUserInfo.influencerId
})

// props 변경 감지해서 meetingId 업데이트
watch(() => props.meetingId, (newMeetingId) => {
  if (newMeetingId) {
    latestMeetingId.value = newMeetingId
  }
}, { immediate: true })

const goToReport = () => {
  if (!influencerId.value || !latestMeetingId.value) {
    console.error('필수 파라미터가 없습니다:', { influencerId: influencerId.value, meetingId: latestMeetingId.value })
    return
  }

  router.push({
    name: 'FanmeetingSummary',
    params: { influencerId: influencerId.value },
    query: {
      meetingId: latestMeetingId.value,
      regenerate: true,
    },
  })
}
</script>
<template>
  <div class="w-full rounded-xl flex flex-col bg-white p-4">
    <div class="flex gap-1 items-center">
      <img :src="Report" class="w-6 h-6" />
      <p class="text-md font-semibold">AI 기반 활동 리포트가 준비됐어요</p>
    </div>

    <p class="text-sm font-medium mt-1">팬미팅 리뷰를 바탕으로 종합 리포트를 만들었어요</p>
    <button
      class="bg-subtle-bg rounded-lg mt-3 mx-auto py-2 px-3 text-sm font-medium transition-opacity"
      :class="{ 'opacity-50 cursor-not-allowed': !latestMeetingId || !influencerId }"
      @click="goToReport"
      :disabled="!latestMeetingId || !influencerId"
    >
      {{ latestMeetingId && influencerId ? '리포트 확인하기' : '리포트 준비 중...' }}
    </button>
  </div>
</template>
