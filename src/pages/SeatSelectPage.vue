<template>
  <div class="w-full min-h-screen bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <button @click="goBack" class="p-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="#000000"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-black">좌석 선택</h1>
      <div class="w-6"></div>
    </div>

    <!-- Fan Meeting Info -->
    <div class="px-4 py-3 bg-gray-50">
      <div class="flex items-center mb-1">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
            stroke="#808080"
            stroke-width="2"
          />
          <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="2" />
        </svg>
        <span class="ml-1 text-sm text-gray-600">{{ currentFanMeeting.venue }}</span>
      </div>
      <h2 class="text-lg font-bold text-black mb-1">{{ currentFanMeeting.title }}</h2>
      <p class="text-sm text-gray-600">{{ currentFanMeeting.date }}</p>
    </div>

    <!-- Stage -->
    <div class="px-4 py-6">
      <div class="bg-gray-800 rounded-xl py-4 mb-8">
        <p class="text-center text-white font-bold text-lg">STAGE</p>
      </div>

      <!-- Seat Map -->
      <div class="space-y-4">
        <!-- Row Labels -->
        <div class="flex justify-center mb-4">
          <div class="text-xs text-gray-600 space-y-2 mr-4">
            <div v-for="row in seatRows" :key="row" class="h-8 flex items-center">
              {{ row }}
            </div>
          </div>

          <!-- Seats Grid -->
          <div class="space-y-2">
            <div v-for="(row, rowIndex) in seatMap" :key="rowIndex" class="flex space-x-1">
              <button
                v-for="(seat, seatIndex) in row"
                :key="seatIndex"
                @click="selectSeat(rowIndex, seatIndex)"
                :disabled="seat.status === 'occupied'"
                :class="getSeatClass(seat)"
                class="w-8 h-8 rounded text-xs font-medium transition-colors"
              >
                {{ seat.number }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Seat Legend -->
      <div class="flex justify-center space-x-6 mb-6">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
          <span class="text-xs text-gray-600">선택 가능</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-brand-primary rounded mr-2"></div>
          <span class="text-xs text-gray-600">선택됨</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-gray-400 rounded mr-2"></div>
          <span class="text-xs text-gray-600">선택 불가</span>
        </div>
      </div>
    </div>

    <!-- Selected Seat Info -->
    <div v-if="selectedSeat" class="px-4 py-3 bg-gray-50 border-t border-gray-200">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm text-gray-600">선택</span>
        <span class="text-sm font-medium text-black"
          >{{ selectedSeat.row }}{{ selectedSeat.number }}</span
        >
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">가격</span>
        <span class="text-lg font-bold text-brand-accent">36,000원</span>
      </div>
    </div>

    <!-- Bottom Button -->
    <div
      class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200"
      style="padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px))"
    >
      <div class="max-w-sm mx-auto px-4">
        <button
          @click="proceedToPayment"
          :disabled="!selectedSeat"
          :class="{
            'bg-brand-primary text-black': selectedSeat,
            'bg-gray-300 text-gray-500': !selectedSeat,
          }"
          class="w-full py-4 rounded-xl font-bold text-lg transition-colors"
        >
          예매하기
        </button>
      </div>
    </div>

    <!-- Bottom Spacer for Navigation -->
    <div class="h-20"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const selectedSeat = ref(null)
const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']

// 팬미팅 데이터
const fanMeetingData = {
  1: {
    name: '태요미네',
    title: "2025 태요미네 팬미팅 '내가 제일 예뻐'",
    date: '2025년 8월 15일 (목) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  2: {
    name: '여단오',
    title: "2025 여단오 팬미팅 '내가 제일 예뻐'",
    date: '2025년 8월 20일 (화) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  3: {
    name: '김민지',
    title: "2025 김민지 팬미팅 '내가 제일 예뻐'",
    date: '2025년 8월 25일 (일) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  4: {
    name: '이서연',
    title: "2025 이서연 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 1일 (일) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  5: {
    name: '박지우',
    title: "2025 박지우 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 5일 (목) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  6: {
    name: '최유나',
    title: "2025 최유나 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 10일 (화) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  7: {
    name: '정하린',
    title: "2025 정하린 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 15일 (일) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
  8: {
    name: '송예린',
    title: "2025 송예린 팬미팅 '내가 제일 예뻐'",
    date: '2025년 9월 20일 (금) 오후 7:00',
    venue: '올림픽공원 체조경기장',
  },
}

// 현재 팬미팅 정보
const currentFanMeeting = computed(() => {
  return fanMeetingData[route.params.id] || fanMeetingData[1]
})

// 좌석 맵 생성 (Figma 디자인 기반)
const seatMap = ref([
  // A-O 행, 각 행당 11개 좌석
  ...Array.from({ length: 15 }, (_, rowIndex) =>
    Array.from({ length: 11 }, (_, seatIndex) => ({
      number: seatIndex + 1,
      row: seatRows[rowIndex],
      status: Math.random() > 0.7 ? 'occupied' : 'available', // 랜덤하게 일부 좌석 점유
      selected: false,
    })),
  ),
])

const selectSeat = (rowIndex, seatIndex) => {
  const seat = seatMap.value[rowIndex][seatIndex]

  if (seat.status === 'occupied') return

  // 기존 선택 해제
  if (selectedSeat.value) {
    const prevSeat = seatMap.value
      .find((row) => row.find((s) => s.selected))
      ?.find((s) => s.selected)
    if (prevSeat) prevSeat.selected = false
  }

  // 새 좌석 선택
  seat.selected = true
  selectedSeat.value = {
    row: seat.row,
    number: seat.number,
    rowIndex,
    seatIndex,
  }
}

const getSeatClass = (seat) => {
  if (seat.status === 'occupied') {
    return 'bg-gray-400 text-white cursor-not-allowed'
  }
  if (seat.selected) {
    return 'bg-brand-primary text-black border-2 border-brand-accent'
  }
  return 'bg-white border-2 border-gray-300 text-gray-700 hover:border-brand-primary'
}

const goBack = () => {
  router.go(-1)
}

const proceedToPayment = () => {
  if (!selectedSeat.value) return

  // 선택된 좌석 정보를 쿼리 파라미터로 전달
  router.push({
    path: `/payment/${route.params.id}`,
    query: {
      seat: `${selectedSeat.value.row}${selectedSeat.value.number}`,
      price: '36000',
    },
  })
}
</script>
