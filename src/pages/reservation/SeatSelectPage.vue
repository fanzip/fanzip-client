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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomButton from '@/components/common/ButtonNav.vue'
import FanMeetingInfo from '@/components/fanmeeting/reservation/FanMeetingInfo.vue'
import SeatMap from '@/components/fanmeeting/reservation/SeatMap.vue'
import SelectedSeatInfo from '@/components/fanmeeting/reservation/SelectedSeatInfo.vue'
import { fetchFanMeeting, fetchSeatsByMeetingId, checkIfAlreadyReserved } from '@/api/fanMeetingApi'
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
    const [rawMeeting, rawSeats] = await Promise.all([
      fetchFanMeeting(route.params.id),
      fetchSeatsByMeetingId(route.params.id),
    ])

    console.log('🔥 [rawSeats 응답 확인]', rawSeats)

    currentFanMeeting.value = {
      title: rawMeeting.title || '팬미팅 제목',
      description: rawMeeting.description ?? '',
      date: dayjs(rawMeeting.meetingDate).format('YYYY년 M월 D일 (dd) A h:mm'),
      venue: rawMeeting.venueName || '장소 미정',
    }

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
          status: seat.reserved ? 'occupied' : 'available',
          selected: false,
          price: seat.price,
        }))

      return seatsInRow.length
        ? seatsInRow
        : Array.from({ length: 11 }, (_, i) => ({
            number: i + 1,
            row: rowLetter,
            status: 'empty',
            selected: false,
          }))
    })

    seatMap.value = groupedSeats
  } catch (err) {
    console.error('팬미팅/좌석 정보 불러오기 실패:', err)
  }
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
    const { data: intent } = await api.post(
      `/api/fan-meetings/${route.params.id}/seats/${selectedSeat.value.seatId}/start-payment`,
    )

    router.push({
      name: 'FanMeetingPaymentPage', // 라우터에 등록된 FanMeetingPaymentPage.vue의 name
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
  } catch (err) {
    console.error('❌ start-payment 호출 실패:', err)
  }
}
</script>
