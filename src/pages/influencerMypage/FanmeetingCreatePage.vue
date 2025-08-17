<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import FanmeetingPlaceInfo from '@/components/influencerMypage/fanmeeting/FanmeetingPlaceInfo.vue'
import FanmeetingForm from '@/components/influencerMypage/fanmeeting/FanmeetingForm.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { createFanMeeting } from '@/api/fanMeetingApi'

// 폼 상태 (자식들이 v-model로 업데이트)
const form = ref({
  influencerId: null,
  title: '',
  description: '',
  meetingDate: '', // 'YYYY-MM-DDTHH:mm'
  generalOpenTime: '', // 'YYYY-MM-DDTHH:mm'
  posterImageUrl: '',
})

const submitting = ref(false)
const address = ref('서울특별시 광진구 능동로 195-16, 602호')

const route = useRoute()
onMounted(() => {
  const id = Number(route.params.influencerId)
  if (Number.isFinite(id)) form.value.influencerId = id
})

// 'YYYY-MM-DDTHH:mm' → 'YYYY-MM-DDTHH:mm:ss'
const toLocalDateTime = (v) => {
  if (!v) return null
  if (typeof v === 'string' && v.length === 16) return `${v}:00`
  if (v instanceof Date) {
    const p = (n) => String(n).padStart(2, '0')
    return `${v.getFullYear()}-${p(v.getMonth() + 1)}-${p(v.getDate())}T${p(v.getHours())}:${p(v.getMinutes())}:${p(v.getSeconds())}`
  }
  return String(v)
}

// DEMO 업로드 (실서비스에선 실제 API 교체)
async function uploadPosterApi(file) {
  return new Promise((r) => setTimeout(() => r({ url: URL.createObjectURL(file) }), 600))
}

// 유효성 (필요 필드만 엄격 체크)
const isValid = computed(() => {
  const f = form.value
  return !!(f.influencerId && f.title?.trim() && f.meetingDate && f.generalOpenTime)
})

const onSubmit = async () => {
  if (submitting.value || !isValid.value) return

  submitting.value = true
  try {
    const payload = {
      influencerId: form.value.influencerId,
      title: form.value.title.trim(),
      description: form.value.description?.trim() ?? '',
      meetingDate: toLocalDateTime(form.value.meetingDate),
      generalOpenTime: toLocalDateTime(form.value.generalOpenTime),
      posterImageUrl: form.value.posterImageUrl || null,
    }
    const res = await createFanMeeting(payload)
    console.log('created', res)
    alert('팬미팅이 등록되었습니다!')
    // ex) router.push({ name: 'FanmeetingDetail', params: { meetingId: res.meetingId } })
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

    <!-- 자식들이 form을 직접 업데이트 -->
    <FanmeetingPlaceInfo
      v-model="form"
      :address="address"
      :uploadPoster="uploadPosterApi"
      class="mt-16 mb-4"
    />
    <FanmeetingForm v-model="form" class="mt-4" />

    <!-- Figma처럼: 비활성 시 회색/클릭막기 -->
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
