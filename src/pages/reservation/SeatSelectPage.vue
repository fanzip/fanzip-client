<template>
  <div class="w-full min-h-screen bg-subtle-bg">
    <AppHeader type="back-title" title="" />
    <div class="w-full max-w-[393px] mx-auto min-h-screen">
      <div class="px-5 md:px-0 pt-[68px] pb-7 space-y-5">
        <FanMeetingInfo
          v-if="currentFanMeeting"
          :title="currentFanMeeting.title"
          :description="currentFanMeeting.description"
          :date="currentFanMeeting.date"
          :venue="currentFanMeeting.venue"
        />
        <SeatMap :seatMap="seatMap" :seatRows="seatRows" @selectSeat="selectSeat" />
        <SelectedSeatInfo
          v-if="selectedSeat"
          :seatName="`${selectedSeat.row}${selectedSeat.number}`"
          :price="`${selectedSeat.price?.toLocaleString()}원`"
        />
      </div>
    </div>
    <BottomButton
      @click="proceedToPayment"
      :disabled="!selectedSeat"
      :variant="selectedSeat ? 'primary' : 'cancel'"
      size="lg"
      >예매하기</BottomButton
    >
    <div class="h-24"></div>
  </div>

  <BaseModal v-if="showAlreadyReservedModal" @close="showAlreadyReservedModal = false">
    <template #title>알림</template>
    <template #default>
      <p class="text-center text-base text-text-base font-medium">이미 예약한 팬미팅입니다.</p>
    </template>
    <template #footer>
      <button
        class="w-full py-2 mt-2 rounded-xl bg-brand-primary text-black font-semibold"
        @click="showAlreadyReservedModal = false"
      >
        확인
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomButton from '@/components/common/ButtonNav.vue'
import FanMeetingInfo from '@/components/fanmeeting/reservation/FanMeetingInfo.vue'
import SeatMap from '@/components/fanmeeting/reservation/SeatMap.vue'
import SelectedSeatInfo from '@/components/fanmeeting/reservation/SelectedSeatInfo.vue'
import { fetchFanMeeting, fetchSeatsByMeetingId, fetchPendingSeatsByMeetingId, checkIfAlreadyReserved } from '@/api/fanMeetingApi'
import BaseModal from '@/components/common/BaseModal.vue'
import api from '@/api'

import dayjs from 'dayjs'
import 'dayjs/locale/ko'
dayjs.locale('ko')

const router = useRouter()
const route = useRoute()
const seatMap = ref([])

const selectedSeat = ref(null)
const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
const showAlreadyReservedModal = ref(false)

const fanMeetingData = {
  /* 그대로 유지 */
}

const currentFanMeeting = ref(null)

onMounted(async () => {
  try {
    const [rawMeeting, rawSeats, pendingSeats] = await Promise.all([
      fetchFanMeeting(route.params.id),
      fetchSeatsByMeetingId(route.params.id),
      fetchPendingSeatsByMeetingId(route.params.id)
    ])

    console.log('🔥 [rawSeats 응답 확인]', rawSeats)
    console.log('🔥 [pendingSeats 응답 확인]', pendingSeats)

    currentFanMeeting.value = {
      title: rawMeeting.title || '팬미팅 제목',
      description: rawMeeting.description ?? '',
      date: dayjs(rawMeeting.meetingDate).format('YYYY년 M월 D일 (dd) A h:mm'),
      venue: rawMeeting.venueName || '장소 미정',
    }

    // pending 상태인 seatId들을 Set으로 만들기
    const pendingSeatIds = new Set(pendingSeats.map(seat => seat.seatId))

    // 좌석을 행(row) 기준으로 그룹화
    const groupedSeats = seatRows.map((rowLetter) => {
      const seatsInRow = rawSeats
        .filter((seat) => seat.seatNumber.trim().startsWith(rowLetter))
        .sort((a, b) => {
          const numA = parseInt(a.seatNumber.slice(1))
          const numB = parseInt(b.seatNumber.slice(1))
          return numA - numB
        })
        .map((seat) => ({
          seatId: seat.seatId,
          number: parseInt(seat.seatNumber.slice(1)),
          row: rowLetter,
          status: seat.reserved ? 'occupied' : pendingSeatIds.has(seat.seatId) ? 'pending' : 'available',
          selected: false,
          price: seat.price,
        }))

      return seatsInRow
    })

    seatMap.value = groupedSeats
  } catch (err) {
    console.error('팬미팅/좌석 정보 불러오기 실패:', err)
  }

  // 페이지 포커스 이벤트 리스너 추가 (다른 탭에서 돌아왔을 때)
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      console.log('🔄 페이지 포커스, 좌석 상태 새로고침')
      refreshSeatData()
    }
  }

  const handleFocus = () => {
    console.log('🔄 윈도우 포커스, 좌석 상태 새로고침')
    refreshSeatData()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('focus', handleFocus)

  // 컴포넌트 언마운트 시 이벤트 리스너 제거
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('focus', handleFocus)
  })
})

const selectSeat = (rowIndex, seatIndex) => {
  const seat = seatMap.value[rowIndex][seatIndex]
  if (seat.status !== 'available') return

  if (selectedSeat.value) {
    const prev = seatMap.value.find((row) => row.find((s) => s.selected))?.find((s) => s.selected)
    if (prev) prev.selected = false
  }

  seat.selected = true
  selectedSeat.value = {
    row: seat.row,
    number: seat.number,
    rowIndex,
    seatIndex,
    seatId: seat.seatId,
    price: seat.price,
  }
}

const updateSeatStatus = (seatId, newStatus) => {
  seatMap.value.forEach((row) => {
    row.forEach((seat) => {
      if (seat.seatId === seatId) {
        seat.status = newStatus
        if (newStatus !== 'available') {
          seat.selected = false
        }
      }
    })
  })
  
  // 선택된 좌석이 사용 불가능하게 되면 선택 해제
  if (selectedSeat.value?.seatId === seatId && newStatus !== 'available') {
    selectedSeat.value = null
  }
}

const refreshSeatData = async () => {
  try {
    const [rawSeats, pendingSeats] = await Promise.all([
      fetchSeatsByMeetingId(route.params.id),
      fetchPendingSeatsByMeetingId(route.params.id)
    ])
    
    console.log('🔥 [rawSeats]', rawSeats)
    console.log('🔥 [pendingSeats]', pendingSeats)
    
    // pending 상태인 seatId들을 Set으로 만들기
    const pendingSeatIds = new Set(pendingSeats.map(seat => seat.seatId))
    
    // 좌석을 행(row) 기준으로 그룹화
    const groupedSeats = seatRows.map((rowLetter) => {
      const seatsInRow = rawSeats
        .filter((seat) => seat.seatNumber.trim().startsWith(rowLetter))
        .sort((a, b) => {
          const numA = parseInt(a.seatNumber.slice(1))
          const numB = parseInt(b.seatNumber.slice(1))
          return numA - numB
        })
        .map((seat) => ({
          seatId: seat.seatId,
          number: parseInt(seat.seatNumber.slice(1)),
          row: rowLetter,
          status: seat.reserved ? 'occupied' : pendingSeatIds.has(seat.seatId) ? 'pending' : 'available',
          selected: false,
          price: seat.price,
        }))

      return seatsInRow
    })

    seatMap.value = groupedSeats
    selectedSeat.value = null // 새로고침 시 선택 초기화
  } catch (err) {
    console.error('좌석 정보 새로고침 실패:', err)
  }
}

const proceedToPayment = async () => {
  if (!selectedSeat.value?.seatId || !selectedSeat.value?.price) return

  try {
    const alreadyReserved = await checkIfAlreadyReserved(route.params.id)
    if (alreadyReserved) {
      showAlreadyReservedModal.value = true
      return
    }
  } catch {
    showAlreadyReservedModal.value = true
    return
  }

  try {
    console.log('🚀 start-payment API 호출 시작:', {
      meetingId: route.params.id,
      seatId: selectedSeat.value.seatId
    })
    
    const { data: intent } = await api.post(
      `/api/fan-meetings/${route.params.id}/seats/${selectedSeat.value.seatId}/start-payment`,
    )
    
    console.log('✅ start-payment API 성공:', intent)

    console.log('🔄 라우터 푸시 시작')
    await router.push({
      name: 'FanMeetingPaymentPage',
      query: {
        paymentType: 'RESERVATION',
        paymentId: intent.paymentId,
        reservationId: intent.reservationId,
        meetingId: route.params.id,
        seatId: selectedSeat.value.seatId,
        seat: `${selectedSeat.value.row}${selectedSeat.value.number}`,
        amount: selectedSeat.value.price + 3000,
        ttl: intent.ttlSeconds,
      },
    })
    
    console.log('✅ 라우터 푸시 완료')
    
    // 라우팅 후에 좌석 상태 변경 (페이지가 이미 이동했으므로 영향 없음)
    updateSeatStatus(selectedSeat.value.seatId, 'pending')
    
  } catch (err) {
    console.error('❌ start-payment 호출 실패:', err)
    alert('결제를 시작할 수 없습니다. 다시 시도해주세요.')
  }
}
</script>
