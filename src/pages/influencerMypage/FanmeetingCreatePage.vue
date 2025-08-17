<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import FanmeetingPlaceInfo from '@/components/influencerMypage/fanmeeting/FanmeetingPlaceInfo.vue'
import FanmeetingForm from '@/components/influencerMypage/fanmeeting/FanmeetingForm.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { createFanMeeting, uploadFanMeetingPoster } from '@/api/fanMeetingApi'

const form = ref({
  influencerId: null,
  title: '',
  description: '',
  meetingDate: '',
  generalOpenTime: '',
  posterImageUrl: '',
})

const route = useRoute()
const router = useRouter()
const submitting = ref(false)
const address = ref('서울특별시 광진구 능동로 195-16, 602호')

onMounted(() => {
  const id = Number(route.params.influencerId)
  if (Number.isFinite(id)) form.value.influencerId = id
})


const toLocalDateTime = (v) => {
  if (!v) return null
  if (typeof v === 'string' && v.length === 16) return `${v}:00`
  if (v instanceof Date) {
    const p = (n) => String(n).padStart(2, '0')
    return `${v.getFullYear()}-${p(v.getMonth() + 1)}-${p(v.getDate())}T${p(v.getHours())}:${p(v.getMinutes())}:${p(v.getSeconds())}`
  }
  return String(v)
}

// 실제 S3 업로드 사용: 업로드 후 form.posterImageUrl에 즉시 반영
const uploadPosterApi = async (file) => {
  const id = Number(form.value.influencerId ?? route.params.influencerId)
  if (!Number.isFinite(id)) throw new Error('influencerId를 확인할 수 없습니다.')

  const { url } = await uploadFanMeetingPoster(file, id)
  form.value.posterImageUrl = url
  return { url }
}

// 필수값 간단 검증
const isValid = computed(() => {
  const f = form.value
  return !!(f.influencerId && f.title?.trim() && f.meetingDate && f.generalOpenTime)
})

const onSubmit = async () => {
  if (submitting.value || !isValid.value) return
  submitting.value = true
  try {
    // DTO 그대로 매핑
    const payload = {
      influencerId: form.value.influencerId,
      title: form.value.title.trim(),
      description: form.value.description?.trim() ?? '',
      meetingDate: toLocalDateTime(form.value.meetingDate),
      generalOpenTime: toLocalDateTime(form.value.generalOpenTime),
      posterImageUrl: form.value.posterImageUrl || null,
    }

    console.log('fanmeeting payload >>>', payload)
    await createFanMeeting(payload)

    alert('팬미팅이 등록되었습니다!')
    router.replace('/influencers-mypage')
  } catch (e) {
    console.error(e)
    alert('등록 중 오류가 발생했습니다.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="팬미팅 정보 추가" />

    <!-- 자식이 포스터를 업로드하면 위의 uploadPosterApi가 S3 → URL 반환 → form.posterImageUrl에 주입 -->
    <FanmeetingPlaceInfo
      v-model="form"
      :address="address"
      :uploadPoster="uploadPosterApi"
      class="mt-16 mb-4"
    />

    <FanmeetingForm v-model="form" class="mt-4" />

    <BaseButton
      size="lg"
      class="m-auto mt-4 mb-4"
      :disabled="submitting || !isValid"
      :class="
        submitting || !isValid
          ? 'bg-subtle-bg  cursor-not-allowed pointer-events-none'
          : 'bg-brand-primary '
      "
      @click="onSubmit"
    >
      {{ submitting ? '등록 중...' : '등록완료' }}
    </BaseButton>
  </div>
</template>
