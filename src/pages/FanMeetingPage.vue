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
      <h1 class="text-lg font-semibold text-black">예약 페이지</h1>
      <div class="w-6"></div>
    </div>

    <!-- Search Bar -->
    <div class="px-4 mb-6">
      <div class="flex items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200">
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          class="bg-transparent flex-1 text-gray-700 placeholder-gray-400 outline-none"
          v-model="searchQuery"
        />
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8" stroke="#808080" stroke-width="2" fill="none" />
          <path
            d="m21 21-4.35-4.35"
            stroke="#808080"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- Influencer List -->
    <div class="px-4 space-y-6 pb-24">
      <div
        v-for="influencer in filteredInfluencers"
        :key="influencer.id"
        class="flex items-center cursor-pointer"
        @click="goToDetail(influencer.id)"
      >
        <div
          :class="`w-16 h-16 rounded-full bg-gradient-to-br ${influencer.bgColor} overflow-hidden mr-6`"
        >
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-white font-bold text-lg">{{ influencer.initial }}</span>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-semibold text-black mb-1">{{ influencer.name }}</h3>
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
            <span class="ml-2 text-gray-400">{{ influencer.location }}</span>
          </div>
        </div>
      </div>

      <!-- 검색 결과가 없을 때 -->
      <div v-if="filteredInfluencers.length === 0" class="text-center py-12">
        <p class="text-gray-500">검색 결과가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// 인플루언서 데이터
const influencers = ref([
  {
    id: 1,
    name: '태요미네',
    location: '서울시 성동구',
    initial: '태',
    bgColor: 'from-pink-400 to-purple-500',
  },
  {
    id: 2,
    name: '여단오',
    location: '서울시 마포구',
    initial: '여',
    bgColor: 'from-blue-400 to-cyan-500',
  },
  {
    id: 3,
    name: '침착맨',
    location: '서울시 마포구',
    initial: '침',
    bgColor: 'from-green-400 to-emerald-500',
  },
  {
    id: 4,
    name: '토모토모',
    location: '부산광역시 해운대구',
    initial: '토',
    bgColor: 'from-orange-400 to-red-500',
  },
  {
    id: 5,
    name: '찰스엔터',
    location: '서울시 강남구',
    initial: '찰',
    bgColor: 'from-purple-400 to-indigo-500',
  },
  {
    id: 6,
    name: '뭐랭하맨',
    location: '서울시 강남구',
    initial: '뭐',
    bgColor: 'from-yellow-400 to-orange-500',
  },
  {
    id: 7,
    name: '빠더너스 BDNS',
    location: '서울시 강남구',
    initial: '빠',
    bgColor: 'from-teal-400 to-blue-500',
  },
  {
    id: 8,
    name: '쯔양',
    location: '서울시 강남구',
    initial: '쯔',
    bgColor: 'from-rose-400 to-pink-500',
  },
])

const filteredInfluencers = computed(() => {
  if (!searchQuery.value) {
    return influencers.value
  }
  return influencers.value.filter(
    (influencer) =>
      influencer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      influencer.location.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const goBack = () => {
  router.go(-1)
}

const goToDetail = (id) => {
  router.push(`/fan-meeting/${id}`)
}
</script>
