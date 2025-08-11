<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- 배경 오버레이 -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="closeModal"
    ></div>
    
    <!-- 모달 컨텐츠 -->
    <div class="relative bg-base-bg rounded-xl shadow-xl max-w-sm w-full max-h-90vh overflow-auto border border-subtle-border">
      <!-- 상단 헤더 -->
      <div class="flex justify-between items-center p-4 border-b border-subtle-border">
        <h3 class="text-lg font-semibold text-text-base">QR 검증 결과</h3>
        <button 
          @click="closeModal"
          class="text-subtle-text hover:text-text-base transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 결과 내용 -->
      <div class="p-6">
        <!-- 성공 상태 -->
        <div v-if="result && result.valid" class="text-center">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h4 class="text-xl font-bold text-green-600 mb-2">입장 승인</h4>
          <p class="text-text-base mb-6">{{ result.message }}</p>
          
          <!-- 사용자 정보 -->
          <div class="bg-subtle-bg rounded-lg p-4 mb-4 border border-subtle-border">
            <h5 class="font-semibold text-text-base mb-2">입장 정보</h5>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-subtle-text">이름:</span>
                <span class="font-medium text-text-base">{{ result.userName || 'N/A' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-subtle-text">이메일:</span>
                <span class="font-medium text-text-base">{{ result.userEmail || 'N/A' }}</span>
              </div>
              <div v-if="result.reservation" class="border-t border-subtle-border pt-2 mt-2">
                <div class="flex justify-between mb-1">
                  <span class="text-subtle-text">팬미팅:</span>
                  <span class="font-medium text-text-base">{{ result.reservation.meetingTitle }}</span>
                </div>
                <div class="flex justify-between mb-1">
                  <span class="text-subtle-text">장소:</span>
                  <span class="font-medium text-text-base">{{ result.reservation.venueName }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-subtle-text">좌석:</span>
                  <span class="font-medium text-text-base">{{ result.reservation.seatNumber }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 실패 상태 -->
        <div v-else-if="result && !result.valid" class="text-center">
          <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          
          <h4 class="text-xl font-bold text-text-emphasis mb-2">입장 거부</h4>
          <p class="text-text-base mb-4">{{ result.message }}</p>
          
          <!-- 에러 정보 (관리자용) -->
          <div v-if="result.errorCode" class="bg-subtle-bg rounded-lg p-4 mb-4 border border-subtle-border">
            <h5 class="font-semibold text-text-emphasis mb-2">에러 상세</h5>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span class="text-text-emphasis">에러 코드:</span>
                <span class="font-medium text-text-base">{{ result.errorCode }}</span>
              </div>
              <div v-if="result.errorDetails" class="text-text-emphasis text-xs mt-2">
                {{ result.errorDetails }}
              </div>
            </div>
          </div>
        </div>

        <!-- 로딩 상태 -->
        <div v-else class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p class="text-subtle-text">QR 코드를 검증 중입니다...</p>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="border-t border-subtle-border p-4">
        <div class="flex gap-3">
          <BaseButton 
            @click="closeModal"
            variant="cancel"
            size="sm"
            class="flex-1"
          >
            닫기
          </BaseButton>
          <BaseButton 
            @click="scanAgain"
            variant="primary"
            size="sm"
            class="flex-1"
          >
            다시 스캔
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  result: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'scan-again'])

const closeModal = () => {
  emit('close')
}

const scanAgain = () => {
  emit('scan-again')
}
</script>

<style scoped>
/* 모달 애니메이션은 필요에 따라 추가 */
.max-h-90vh {
  max-height: 90vh;
}
</style>