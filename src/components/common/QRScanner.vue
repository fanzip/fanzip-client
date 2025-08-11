<template>
  <div class="qr-scanner-container">
    <!-- 카메라 뷰 -->
    <div class="camera-container relative">
      <video
        ref="videoElement"
        :class="[
          'w-full h-full object-cover rounded-lg cursor-pointer',
          { 'mirror': facingMode === 'user' }
        ]"
        autoplay
        muted
        playsinline
        @click="handleVideoClick"
      ></video>
      
      <!-- QR 인식 오버레이 -->
      <div class="scanner-overlay">
        <div class="scanner-frame">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
        </div>
      </div>

      <!-- 숨겨진 캔버스 (QR 분석용) -->
      <canvas ref="canvasElement" style="display: none;"></canvas>
    </div>

    <!-- 컨트롤 버튼들 -->
    <div class="controls mt-4 flex justify-center gap-4">
      <button 
        @click="toggleCamera"
        class="px-4 py-2 bg-brand-primary text-black rounded-lg font-semibold hover:bg-brand-accent"
        :disabled="isLoading"
      >
        {{ isScanning ? '스캔 중지' : '스캔 시작' }}
      </button>
      
      <button 
        @click="switchCamera"
        class="px-4 py-2 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300"
        :disabled="isLoading || !isScanning"
      >
        카메라 전환
      </button>
    </div>

    <!-- 상태 메시지 -->
    <div class="status-message mt-4 text-center">
      <p v-if="isLoading" class="text-gray-600">카메라를 준비 중입니다...</p>
      <p v-else-if="error" class="text-red-500">{{ error }}</p>
      <p v-else-if="isScanning" class="text-green-600">QR 코드를 카메라에 비춰주세요</p>
      <p v-else class="text-gray-600">스캔 시작 버튼을 누르세요</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import jsQR from 'jsqr'

const emit = defineEmits(['qr-detected', 'error'])

// Refs
const videoElement = ref(null)
const canvasElement = ref(null)
const isScanning = ref(false)
const isLoading = ref(false)
const error = ref(null)
const facingMode = ref('environment') // 'user' | 'environment'
const stream = ref(null)
const animationId = ref(null)
const lastDetectedQR = ref('')
const detectionCooldown = ref(false)

// 실제 QR 코드 감지 로직
const detectQRCode = () => {
  if (!videoElement.value || !canvasElement.value || !isScanning.value) return

  const video = videoElement.value
  const canvas = canvasElement.value
  const context = canvas.getContext('2d')

  // 비디오가 준비되지 않았으면 다음 프레임에서 재시도
  if (video.readyState !== video.HAVE_ENOUGH_DATA) {
    animationId.value = requestAnimationFrame(detectQRCode)
    return
  }

  // 캔버스 크기를 비디오 크기에 맞춤
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  // 비디오 프레임을 캔버스에 그리기
  context.drawImage(video, 0, 0, canvas.width, canvas.height)
  
  // 이미지 데이터 가져오기
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
  
  // jsQR로 QR 코드 감지
  const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  })
  
  if (qrCode) {
    // 중복 감지 방지: 같은 QR 코드이거나 쿨다운 중이면 무시
    if (qrCode.data === lastDetectedQR.value || detectionCooldown.value) {
      if (isScanning.value) {
        animationId.value = requestAnimationFrame(detectQRCode)
      }
      return
    }
    
    console.log('QR 코드 감지됨:', qrCode.data)
    lastDetectedQR.value = qrCode.data
    detectionCooldown.value = true
    
    // QR 감지 후 3초간 쿨다운
    setTimeout(() => {
      detectionCooldown.value = false
      lastDetectedQR.value = ''
    }, 3000)
    
    emit('qr-detected', qrCode.data)
    
    // QR 코드를 찾아도 계속 스캔 진행 (쿨다운 중에는 무시됨)
  }
  
  // QR 코드를 찾지 못하면 다음 프레임에서 다시 시도
  if (isScanning.value) {
    animationId.value = requestAnimationFrame(detectQRCode)
  }
}

const startCamera = async () => {
  try {
    isLoading.value = true
    error.value = null

    const constraints = {
      video: {
        facingMode: facingMode.value,
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    }

    stream.value = await navigator.mediaDevices.getUserMedia(constraints)
    
    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
      await videoElement.value.play()
      
      // 스캔 시작
      isScanning.value = true
      detectQRCode()
    }
  } catch (err) {
    console.error('카메라 접근 실패:', err)
    error.value = '카메라에 접근할 수 없습니다. 권한을 확인해주세요.'
    emit('error', error.value)
  } finally {
    isLoading.value = false
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
  
  if (videoElement.value) {
    videoElement.value.srcObject = null
  }
  
  isScanning.value = false
}

const toggleCamera = () => {
  if (isScanning.value) {
    stopCamera()
  } else {
    startCamera()
  }
}

const switchCamera = async () => {
  if (isScanning.value) {
    facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
    stopCamera()
    await new Promise(resolve => setTimeout(resolve, 100)) // 짧은 대기
    startCamera()
  }
}

// 비디오 클릭 핸들러 (필요시 포커스용)
const handleVideoClick = () => {
  // 카메라 포커스나 기타 기능용으로 사용 가능
}

// 감지 상태 리셋 (다시 스캔하기용)
const resetDetection = () => {
  console.log('QR 스캐너 리셋 시작 - 현재 상태:', {
    isScanning: isScanning.value,
    detectionCooldown: detectionCooldown.value,
    lastDetectedQR: lastDetectedQR.value
  })
  
  detectionCooldown.value = false
  lastDetectedQR.value = ''
  error.value = null
  
  // 스캐닝이 중단되었다면 다시 시작
  if (isScanning.value && !animationId.value) {
    console.log('스캐닝 재시작...')
    detectQRCode()
  }
  
  console.log('QR 감지 상태 리셋 완료')
}

// 외부에서 호출할 수 있도록 expose
defineExpose({
  resetDetection,
  startCamera,
  stopCamera
})

onMounted(() => {
  // 자동으로 카메라 시작
  startCamera()
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.qr-scanner-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.camera-container {
  aspect-ratio: 4/3;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.mirror {
  transform: scaleX(-1);
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}

.scanner-frame {
  width: 250px;
  height: 250px;
  position: relative;
  border: 2px solid transparent;
}

.corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 3px solid #00ff00;
}

.corner.top-left {
  top: -3px;
  left: -3px;
  border-right: none;
  border-bottom: none;
}

.corner.top-right {
  top: -3px;
  right: -3px;
  border-left: none;
  border-bottom: none;
}

.corner.bottom-left {
  bottom: -3px;
  left: -3px;
  border-right: none;
  border-top: none;
}

.corner.bottom-right {
  bottom: -3px;
  right: -3px;
  border-left: none;
  border-top: none;
}

/* 스캔 애니메이션 효과 */
.scanner-frame::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #00ff00, transparent);
  animation: scan-line 2s linear infinite;
}

@keyframes scan-line {
  0% { transform: translateY(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(247px); opacity: 0; }
}
</style>