<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import { fancardApi } from '@/api/fancardApi'
import { useAuthStore } from '@/stores/authStore'

// 팬미팅 정보를 query에서 가져옴
const route = useRoute()
const authStore = useAuthStore()

const ticket = ref({
  imgUrl: '/images/fanmeeting.jpg',
  title: "팬미팅 정보를 불러오는 중...",
  location: '',
  date: '',
  dayOfWeek: '',
  time: '',
  seat: '',
  qrUrl: '/images/qr.png',
})

// 현재 로그인한 사용자 ID 가져오기
const getCurrentUserId = () => {
  return authStore.user?.id || 1 // fallback to 1 for testing
}

// 예약 정보로부터 티켓 정보 업데이트
const updateTicketFromReservation = (reservation) => {
  if (!reservation) return
  
  const meetingDate = new Date(reservation.meetingDate)
  const dateStr = `${meetingDate.getMonth() + 1}/${meetingDate.getDate()}`
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const dayOfWeek = dayNames[meetingDate.getDay()]
  const timeStr = meetingDate.toLocaleTimeString('ko-KR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
  
  ticket.value = {
    ...ticket.value,
    title: reservation.meetingTitle || ticket.value.title,
    location: reservation.venueName || ticket.value.location,
    date: dateStr,
    dayOfWeek: dayOfWeek,
    time: timeStr,
    seat: reservation.seatNumber || ticket.value.seat
  }
}

// QR 코드 관련 상태
const qrData = ref(null)
const isGeneratingQr = ref(false)
const qrExpiryTime = ref(30)
const qrTimer = ref(null)
const currentLocation = ref({ latitude: null, longitude: null })
const locationError = ref('')
const isLocationAllowed = ref(false)

// 위치 정보 가져오기
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저에서는 위치 서비스를 지원하지 않습니다.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation.value = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        isLocationAllowed.value = true
        resolve(currentLocation.value)
      },
      (error) => {
        let errorMessage = ''
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근이 거부되었습니다.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.'
            break
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청이 시간 초과되었습니다.'
            break
          default:
            errorMessage = '위치 정보를 가져오는 중 오류가 발생했습니다.'
            break
        }
        locationError.value = errorMessage
        reject(new Error(errorMessage))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      },
    )
  })
}

// QR 코드 생성
const generateQrCode = async () => {
  try {
    isGeneratingQr.value = true
    locationError.value = ''

    // 위치 정보 가져오기
    await getCurrentLocation()

    console.log('현재 위치:', currentLocation.value) // 디버깅용

    const qrRequest = {
      reservationId: route.query.reservationId || 1,
      userId: getCurrentUserId(), // 로그인한 사용자 ID
      fanMeetingId: route.query.fanMeetingId || 1,
      latitude: currentLocation.value.latitude,
      longitude: currentLocation.value.longitude,
      deviceInfo: navigator.userAgent,
    }

    console.log('QR 요청 데이터:', qrRequest) // 디버깅용

    const response = await fancardApi.generateQrCode(qrRequest)

    console.log('QR 응답 데이터:', response.data) // 디버깅용

    if (response.data.status === 'LOCATION_ERROR') {
      locationError.value = '행사장 근처에서만 QR 코드를 생성할 수 있습니다.'
      return
    }

    qrData.value = response.data
    
    // QR 응답에 예약 정보가 있으면 티켓 정보 업데이트
    if (response.data.reservation) {
      updateTicketFromReservation(response.data.reservation)
    }

    // 30초 타이머 시작
    startQrTimer()
  } catch (error) {
    console.error('QR 코드 생성 실패:', error)
    console.error('에러 응답:', error.response?.data) // 디버깅용
    if (error.message.includes('위치')) {
      locationError.value = error.message
    } else {
      locationError.value = 'QR 코드 생성에 실패했습니다. 다시 시도해주세요.'
    }
  } finally {
    isGeneratingQr.value = false
  }
}

// QR 코드 타이머 시작
const startQrTimer = () => {
  qrExpiryTime.value = 30

  qrTimer.value = setInterval(() => {
    qrExpiryTime.value -= 1

    if (qrExpiryTime.value <= 0) {
      clearInterval(qrTimer.value)
      qrData.value = null
    }
  }, 1000)
}

// 위치 접근 권한 확인
const checkLocationPermission = async () => {
  try {
    await getCurrentLocation()
  } catch (error) {
    console.log('위치 권한 확인:', error.message)
  }
}

// onClose 함수는 AppHeader의 close 타입에서 자동으로 처리됨

onMounted(() => {
  checkLocationPermission()
})

onUnmounted(() => {
  if (qrTimer.value) {
    clearInterval(qrTimer.value)
  }
})
</script>

<template>
  <div class="w-full min-h-screen flex flex-col bg-subtle-bg p-5">
    <AppHeader type="close"></AppHeader>
    <div class="bg-white rounded-lg shadow-md max-w-md w-full mt-12">
      <div class="p-5 flex flex-col">
        <img src="/src/assets/fancard/TomoTomo.svg" alt="" />
        <!-- <img :src="ticket.imgUrl" alt="ticket image" class="rounded-xl mb-2" /> -->
        <div class="mt-5">
          <p class="font-bold text-xl">{{ ticket.title }}</p>
          <div class="text-subtle-text text-base flex items-center gap-1">
            <img src="/src/assets/common/map-pin.svg" alt="" />
            <span>{{ ticket.location }}</span>
          </div>
        </div>
      </div>

      <div class="relative my-2 mx-4">
        <div class="border border-dashed border-subtle-border"></div>
        <div
          class="absolute -left-9 top-1/2 w-8 h-8 bg-subtle-bg rounded-full -translate-y-1/2"
        ></div>
        <div
          class="absolute -right-9 top-1/2 w-8 h-8 bg-subtle-bg rounded-full -translate-y-1/2"
        ></div>
      </div>

      <div class="p-7 flex justify-between items-start">
        <div class="space-y-5">
          <p class="text-lg font-medium">{{ ticket.date }}({{ ticket.dayOfWeek }})</p>
          <p class="text-3xl font-medium">{{ ticket.time }} ~</p>
          <div class="flex">
            <p class="font-normal text-base">일반석(</p>
            <p class="font-bold">{{ ticket.seat }}</p>
            <p>)</p>
          </div>
        </div>

        <!-- QR 코드 표시 영역 -->
        <div class="flex flex-col items-center space-y-2">
          <!-- QR 코드가 생성된 경우 -->
          <div v-if="qrData && qrData.qrCodeUrl" class="flex flex-col items-center space-y-2">
            <img :src="qrData.qrCodeUrl" alt="Generated QR Code" class="w-28 h-28" />

            <!-- 진행 바 -->
            <div class="w-28 space-y-1">
              <div class="w-full bg-subtle-bg rounded-full h-2 relative">
                <div
                  class="bg-brand-primary h-2 rounded-full transition-all duration-1000"
                  :style="`width: ${(qrExpiryTime / 30) * 100}%`"
                ></div>
                <!-- 새로고침 버튼 -->
                <button
                  @click="generateQrCode"
                  :disabled="isGeneratingQr"
                  class="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="QR 새로고침"
                >
                  <svg class="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <p class="text-xs text-brand-primary text-center font-semibold">
                {{ qrExpiryTime }}초 남음
              </p>
            </div>
          </div>

          <!-- 기본 QR 코드 (생성되지 않은 경우) -->
          <div v-else class="flex flex-col items-center space-y-2">
            <img
              src="/src/assets/fancard/QR_Code.svg"
              alt="Default QR"
              class="w-28 h-28 p-3 opacity-50"
              style="filter: grayscale(1) brightness(1.2)"
            />

            <!-- QR 생성 버튼 -->
            <button
              :disabled="isGeneratingQr"
              @click="generateQrCode"
              class="px-3 py-1 bg-brand-primary text-black text-xs font-semibold rounded-lg hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isGeneratingQr">생성 중...</span>
              <span v-else>QR 생성하기</span>
            </button>
          </div>

          <!-- 위치 권한 안내 -->
          <div
            v-if="!isLocationAllowed && !locationError && !qrData"
            class="text-subtle-text text-xs text-center max-w-28"
          >
            <p>행사장 근처에서만 생성 가능</p>
          </div>
        </div>
      </div>

      <!-- 에러 메시지 (전체 div 영역에 걸쳐서) -->
      <div v-if="locationError" class="px-7 pb-3">
        <div
          class="text-text-emphasis text-xs text-center bg-subtle-bg p-2 rounded-lg border border-subtle-border"
        >
          {{ locationError }}
        </div>
      </div>
      <div class="relative my-2 mx-4">
        <div class="border border-dashed border-subtle-border"></div>
        <div
          class="absolute -left-9 top-1/2 w-8 h-8 bg-subtle-bg rounded-full -translate-y-1/2"
        ></div>
        <div
          class="absolute -right-9 top-1/2 w-8 h-8 bg-subtle-bg rounded-full -translate-y-1/2"
        ></div>
      </div>

      <div class="flex flex-col justify-center text-xs text-subtle-text p-5 space-y-1">
        <p>· 입장은 팬미팅 시작 1시간 전부터 가능합니다.</p>
        <p>· 지정된 좌석 외의 착석은 제한됩니다.</p>
        <p>· 티켓은 타인에게 양도하거나 환불이 불가합니다.</p>
        <p>· 본 티켓은 모바일 화면으로만 입장이 가능합니다. (캡처 화면 불가)</p>
        <p>· 현장에서 본인 확인이 어려운 경우, 입장이 제한될 수 있습니다.</p>
      </div>
    </div>
  </div>
</template>
