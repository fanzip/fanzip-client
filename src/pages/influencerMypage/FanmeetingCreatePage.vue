<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import FanmeetingPlaceInfo from '@/components/influencerMypage/fanmeeting/FanmeetingPlaceInfo.vue';
import FanmeetingForm from '@/components/influencerMypage/fanmeeting/FanmeetingForm.vue';
import BaseButton from '@/components/common/BaseButton.vue';


// ✅ 폼 상태
const form = ref({
  influencerId: null,
  title: '',
  description: '',
  meetingDate: '',        // 'YYYY-MM-DDTHH:mm'
  generalOpenTime: '',    // 'YYYY-MM-DDTHH:mm'
  posterImageUrl: '',
})

// ✅ 주소
const address = ref('서울특별시 광진구 능동로 195-16, 602호')

// ✅ 업로드 API (예시: 실제 구현으로 교체)
async function uploadPosterApi(file) {
  // const fd = new FormData()
  // fd.append('file', file)
  // const { data } = await api.post('/files', fd)
  // return { url: data.url }
  return new Promise((resolve) =>
    setTimeout(() => resolve({ url: URL.createObjectURL(file) }), 600)
  )
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="팬미팅 정보 추가" />
    <FanmeetingPlaceInfo
      v-model="form"
      :address="address"
      :uploadPoster="uploadPosterApi"
      class="mt-16 mb-4"
    />
    <FanmeetingForm v-model="form" class="mt-4" />

    <BaseButton size="sm" class="m-auto mt-4 mb-4">등록</BaseButton>
  </div>
</template>
