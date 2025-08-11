<template>
  <div class="min-h-screen bg-base-bg font-sans mx-auto w-full max-w-xs md:max-w-sm">
    <!-- 헤더 -->
    <AppHeader type="back" title="QR 검증" />

    <!-- 회색 배경 영역 - 스캐너 하단 20px까지 -->
    <div class="bg-subtle-bg pt-[60px] pb-5 px-4">
      <!-- 안내 메시지 -->
      <section class="text-center space-y-2 mb-6">
        <h2 class="text-xl font-bold text-text-base">QR 코드 검증</h2>
        <p class="text-subtle-text text-sm">팬미팅 입장 QR 코드를 카메라에 비춰주세요</p>
      </section>

      <!-- QR 스캐너 컴포넌트 - 흰색 박스 -->
      <section class="mx-2 bg-base-bg rounded-lg p-4 border border-subtle-border">
        <QRScanner ref="qrScannerRef" @qr-detected="handleQRDetected" @error="handleScanError" />
      </section>
    </div>

    <!-- 메인 컨텐츠 -->
    <main class="px-4">
      <!-- 최근 검증 결과 -->
      <section
        v-if="recentResults.length > 0"
        class="mt-6 bg-base-bg rounded-lg p-4 border border-subtle-border space-y-3"
      >
        <h3 class="text-sm font-semibold text-text-base">최근 검증 결과</h3>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          <div
            v-for="(result, index) in recentResults.slice(0, 5)"
            :key="index"
            class="flex items-center justify-between p-2 bg-subtle-bg rounded-lg"
          >
            <div class="flex items-center gap-2">
              <div
                :class="['w-2 h-2 rounded-full', result.isValid ? 'bg-green-500' : 'bg-red-500']"
              ></div>
              <span class="text-xs font-medium text-text-base">
                {{ result.userName || 'Unknown' }}
              </span>
            </div>
            <span class="text-xs text-subtle-text">
              {{ formatTime(result.validatedAt) }}
            </span>
          </div>
        </div>
      </section>
    </main>

    <!-- 검증 결과 모달 -->
    <QRValidationResult
      :is-visible="showResult"
      :result="currentResult"
      @close="closeResultModal"
      @scan-again="resetAndScanAgain"
    />

    <!-- 로딩 오버레이 -->
    <div
      v-if="isValidating"
      class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-base-bg rounded-lg p-6 flex items-center gap-3 border border-subtle-border">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
        <span class="text-text-base">검증 중...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { fancardApi } from '@/api/fancardApi'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import QRScanner from '@/components/common/QRScanner.vue'
import QRValidationResult from '@/components/common/QRValidationResult.vue'

const router = useRouter()
const authStore = useAuthStore()

// Refs
const qrScannerRef = ref(null)

// State
const isValidating = ref(false)
const showResult = ref(false)
const currentResult = ref(null)
const recentResults = ref([])

// QR 스캔 감지 핸들러
const handleQRDetected = async (qrData) => {
  console.log('QR 감지됨:', qrData)
  await validateQRCode(qrData)
}

// 스캔 에러 핸들러
const handleScanError = (error) => {
  console.error('QR 스캔 에러:', error)
  // 에러 토스트나 알림 표시 가능
}

// QR 코드 검증 함수
const validateQRCode = async (qrData) => {
  if (!qrData || isValidating.value) return

  try {
    isValidating.value = true

    // 위치 정보 가져오기 (선택사항)
    let latitude = null
    let longitude = null

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false,
        })
      })
      latitude = position.coords.latitude
      longitude = position.coords.longitude
    } catch (geoError) {
      console.warn('위치 정보 획득 실패:', geoError)
      // 위치 정보가 없어도 검증은 진행
    }

    const validationData = {
      qrData: qrData.trim(),
      latitude,
      longitude,
    }

    console.log('검증 데이터 전송:', validationData)

    const response = await fancardApi.validateQrCode(validationData)
    const result = response.data

    console.log('검증 결과:', result)

    // 결과를 최근 결과 목록에 추가
    recentResults.value.unshift({
      ...result,
      timestamp: new Date().toISOString(),
    })

    // 최대 10개만 보관
    if (recentResults.value.length > 10) {
      recentResults.value = recentResults.value.slice(0, 10)
    }

    // 결과 모달 표시
    currentResult.value = result
    showResult.value = true
  } catch (error) {
    console.error('QR 검증 실패:', error)

    let errorMessage = 'QR 검증 중 오류가 발생했습니다.'
    let errorCode = 'UNKNOWN_ERROR'

    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || errorMessage
      errorCode = error.response.data.errorCode || errorCode
    }

    // 에러 결과 표시
    currentResult.value = {
      isValid: false,
      status: 'ERROR',
      message: errorMessage,
      errorCode: errorCode,
      errorDetails: error.message,
      validatedAt: new Date().toISOString(),
    }

    showResult.value = true
  } finally {
    isValidating.value = false
  }
}

// 결과 모달 닫기
const closeResultModal = () => {
  showResult.value = false
  currentResult.value = null
}

// 다시 스캔
const resetAndScanAgain = () => {
  closeResultModal()
  // QR 스캐너 상태 리셋 (쿨다운 제거)
  if (qrScannerRef.value) {
    qrScannerRef.value.resetDetection()
  }
}

// 시간 포맷팅
const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// 컴포넌트 마운트
onMounted(() => {
  console.log('QR 검증 페이지 로드됨')
})
</script>

<style scoped>
/* 추가 스타일링은 필요에 따라 */
</style>
