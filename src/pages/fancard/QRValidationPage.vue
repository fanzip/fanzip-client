<template>
  <div class="flex flex-col min-h-screen bg-[#f3f4f6]">
    <!-- 헤더 -->
    <header class="flex-shrink-0">
      <AppHeader type="back" title="QR 검증" />
    </header>

    <!-- 메인 컨텐츠 -->
    <main class="flex-1 flex flex-col pt-[60px] pb-[20px] px-4">
      <!-- QR 스캐너 -->
      <div class="flex-1 flex flex-col">
        <!-- 안내 메시지 -->
        <div class="mb-6 text-center">
          <h2 class="text-xl font-bold text-gray-900 mb-2">QR 코드 검증</h2>
          <p class="text-gray-600">팬미팅 입장 QR 코드를 카메라에 비춰주세요</p>
        </div>

        <!-- QR 스캐너 컴포넌트 -->
        <div class="flex-1 flex items-center justify-center">
          <QRScanner 
            ref="qrScannerRef"
            @qr-detected="handleQRDetected"
            @error="handleScanError"
          />
        </div>

        <!-- 수동 입력 옵션 -->
        <div class="mt-6 border-t border-gray-200 pt-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">수동 입력</h3>
          <div class="flex gap-2">
            <input 
              v-model="manualQRCode"
              type="text"
              placeholder="QR 코드를 직접 입력하세요"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            />
            <BaseButton 
              @click="validateManualInput"
              size="sm"
              variant="primary"
              :disabled="!manualQRCode.trim() || isValidating"
            >
              검증
            </BaseButton>
          </div>
        </div>

        <!-- 최근 검증 결과 -->
        <div v-if="recentResults.length > 0" class="mt-6 border-t border-gray-200 pt-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">최근 검증 결과</h3>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <div 
              v-for="(result, index) in recentResults.slice(0, 5)"
              :key="index"
              class="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
            >
              <div class="flex items-center gap-2">
                <div 
                  :class="[
                    'w-2 h-2 rounded-full',
                    result.isValid ? 'bg-green-500' : 'bg-red-500'
                  ]"
                ></div>
                <span class="text-xs font-medium">
                  {{ result.userName || 'Unknown' }}
                </span>
              </div>
              <span class="text-xs text-gray-500">
                {{ formatTime(result.validatedAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 검증 결과 모달 -->
    <QRValidationResult 
      :is-visible="showResult"
      :result="currentResult"
      @close="closeResultModal"
      @scan-again="resetAndScanAgain"
    />

    <!-- 로딩 오버레이 -->
    <div v-if="isValidating" class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg p-6 flex items-center gap-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
        <span class="text-gray-700">검증 중...</span>
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
const manualQRCode = ref('')
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
          enableHighAccuracy: false
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
      longitude
    }

    console.log('검증 데이터 전송:', validationData)

    const response = await fancardApi.validateQrCode(validationData)
    const result = response.data

    console.log('검증 결과:', result)

    // 결과를 최근 결과 목록에 추가
    recentResults.value.unshift({
      ...result,
      timestamp: new Date().toISOString()
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
      validatedAt: new Date().toISOString()
    }
    
    showResult.value = true

  } finally {
    isValidating.value = false
  }
}

// 수동 입력 검증
const validateManualInput = async () => {
  if (manualQRCode.value.trim()) {
    await validateQRCode(manualQRCode.value)
    manualQRCode.value = '' // 검증 후 입력 필드 초기화
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
    second: '2-digit'
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