<template>
  <div class="w-full min-h-screen bg-white">
    <!-- White Container -->
    <div class="w-full max-w-xs md:max-w-sm mx-auto bg-white min-h-screen">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 bg-white">
        <div class="w-6"></div>
        <h1 class="text-lg font-semibold text-black">결제 완료 안내</h1>
        <div class="w-6"></div>
      </div>

      <!-- Success Content -->
      <div class="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <!-- Success Icon -->
        <div class="w-32 h-32 rounded-full flex items-center justify-center mb-12">
          <BsCheckCircleFill class="w-20 h-20 text-green-500" />
        </div>

        <h2 class="text-xl font-bold text-black mb-20">결제가 완료되었습니다!</h2>
      </div>

      <!-- Action Buttons -->
      <div class="px-4 pb-28 space-y-3">
        <div class="w-full flex justify-center">
          <BaseButton @click="goToFanCard" variant="primary" size="lg">
            팬카드 보러가기
          </BaseButton>
        </div>
        <div class="w-full flex justify-center">
          <BaseButton @click="goHome" variant="cancel" size="lg"> 돌아가기 </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import BsCheckCircleFill from '@/assets/icons/BsCheckCircleFill.svg'

const router = useRouter()
const route = useRoute()

const fanMeetingId = ref('1')

const goHome = () => {
  router.push('/')
}

const goToFanCard = () => {
  // 선택한 인플루언서의 팬카드 상세 페이지로 이동
  router.push(`/fancard/detail/${fanMeetingId.value}`)
}

onMounted(() => {
  // 쿼리 파라미터에서 팬미팅 ID 가져오기
  fanMeetingId.value = route.query.fanMeetingId || '1'
})
</script>
