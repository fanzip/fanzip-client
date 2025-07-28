<template>
  <div class="w-full min-h-screen bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 bg-white">
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
      <h1 class="text-lg font-semibold text-black">예약 페이지</h1>
      <div class="w-6"></div>
    </div>

    <!-- Search Bar -->
    <div class="px-4 mb-6">
      <div class="flex items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8" stroke="#9CA3AF" stroke-width="2" />
          <path
            d="21 21L16.65 16.65"
            stroke="#9CA3AF"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          class="ml-3 bg-transparent flex-1 text-gray-700 placeholder-gray-400 outline-none"
          v-model="searchQuery"
        />
      </div>
    </div>

    <!-- Influencer List -->
    <div class="px-9 space-y-6 pb-24">
      <!-- 태요미네 -->
      <div class="flex items-center cursor-pointer" @click="goToDetail(1)">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 overflow-hidden mr-6"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">태</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">태요미네</h3>
          <div class="flex items-center text-gray-500 text-base">
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
                stroke-width="1.5"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="1.5" />
            </svg>
            <span class="ml-2">서울시 성동구</span>
          </div>
        </div>
      </div>

      <!-- 여단오 -->
      <div class="flex items-center cursor-pointer" @click="goToDetail(2)">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 overflow-hidden mr-6"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">여</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">여단오</h3>
          <div class="flex items-center text-gray-500 text-base">
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
                stroke-width="1.5"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="1.5" />
            </svg>
            <span class="ml-2">서울시 마포구</span>
          </div>
        </div>
      </div>

      <!-- 침착맨 -->
      <div class="flex items-center cursor-pointer" @click="goToDetail(3)">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 overflow-hidden mr-6"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">침</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">침착맨</h3>
          <div class="flex items-center text-gray-500 text-base">
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
                stroke-width="1.5"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="1.5" />
            </svg>
            <span class="ml-2">서울시 마포구</span>
          </div>
        </div>
      </div>

      <!-- 토모토모 -->
      <div class="flex items-center cursor-pointer" @click="goToDetail(4)">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 overflow-hidden mr-6"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">토</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">토모토모</h3>
          <div class="flex items-center text-gray-500 text-base">
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
                stroke-width="1.5"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="1.5" />
            </svg>
            <span class="ml-2">부산광역시 해운대구</span>
          </div>
        </div>
      </div>

      <!-- 찰스엔터 -->
      <div class="flex items-center cursor-pointer" @click="goToDetail(5)">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 overflow-hidden mr-6"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">찰</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">찰스엔터</h3>
          <div class="flex items-center text-gray-500 text-base">
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
                stroke-width="1.5"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="1.5" />
            </svg>
            <span class="ml-2">서울시 강남구</span>
          </div>
        </div>
      </div>

      <!-- 뭐랭하맨 -->
      <div class="flex items-center cursor-pointer" @click="goToDetail(6)">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 overflow-hidden mr-6"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">뭐</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">뭐랭하맨</h3>
          <div class="flex items-center text-gray-500 text-base">
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
                stroke-width="1.5"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="1.5" />
            </svg>
            <span class="ml-2">서울시 강남구</span>
          </div>
        </div>
      </div>

      <!-- 빠더너스 BDNS -->
      <div class="flex items-center cursor-pointer" @click="goToDetail(7)">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 overflow-hidden mr-6"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">빠</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">빠더너스 BDNS</h3>
          <div class="flex items-center text-gray-500 text-base">
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
                stroke-width="1.5"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="1.5" />
            </svg>
            <span class="ml-2">서울시 강남구</span>
          </div>
        </div>
      </div>

      <!-- 쯔양 -->
      <div class="flex items-center cursor-pointer" @click="goToDetail(8)">
        <div
          class="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 overflow-hidden mr-6"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">쯔</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">쯔양</h3>
          <div class="flex items-center text-gray-500 text-base">
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
                stroke-width="1.5"
              />
              <circle cx="12" cy="10" r="3" stroke="#808080" stroke-width="1.5" />
            </svg>
            <span class="ml-2">서울시 강남구</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// Sample fan meeting data - 실제로는 API에서 가져올 데이터
const fanMeetings = ref([
  {
    id: 1,
    title: "2025 여단오 팬미팅 '내가 제일 예뻐'",
    venue: '올림픽공원 체조경기장',
    date: '2025년 8월 15일 (목) 오후 7:00',
    price: '36,000',
    image: null,
  },
  {
    id: 2,
    title: "아이유 팬미팅 'Through the Night'",
    venue: '잠실실내체육관',
    date: '2025년 9월 20일 (토) 오후 6:00',
    price: '45,000',
    image: null,
  },
])

const filteredFanMeetings = computed(() => {
  if (!searchQuery.value) {
    return fanMeetings.value
  }
  return fanMeetings.value.filter(
    (fanMeeting) =>
      fanMeeting.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      fanMeeting.venue.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const goBack = () => {
  router.go(-1)
}

const goToDetail = (id) => {
  router.push(`/fan-meeting/${id}`)
}

const goToSeatSelection = (id) => {
  router.push(`/seat-select/${id}`)
}

onMounted(() => {
  // 팬미팅 데이터 로드
  // fetchFanMeetings()
})
</script>
