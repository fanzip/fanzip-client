<template>
  <div class="w-full min-h-screen bg-base-bg">
    <!-- Header -->
    <AppHeader type="logo" title="" />

    <!-- Search Bar -->
    <div class="pt-[68px] mb-7">
      <SearchBar ref="searchBarRef" />
    </div>

    <!-- Influencer List -->
    <div class="pl-9 pb-24">
      <template v-if="filteredInfluencers.length > 0">
        <div
          v-for="(influencer, index) in filteredInfluencers"
          :key="influencer.id"
          :class="['flex items-center cursor-pointer w-full h-16', index > 0 ? 'mt-8' : '']"
          @click="goToDetail(influencer.id)"
        >
          <div v-if="influencer.id === 2" class="w-16 h-16 rounded-full overflow-hidden mr-6">
            <img
              src="@/assets/icons/yeodano.svg"
              :alt="influencer.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
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
      </template>

      <!-- 검색 결과가 없을 때 -->
      <div v-else class="flex items-center justify-center h-64">
        <p class="text-subtle-text text-base">검색 결과가 없습니다.</p>
      </div>
    </div>
  </div>
  <AppNav />
</template>

<script setup>
import { ref, computed, toValue } from 'vue'
import { useRouter } from 'vue-router'
import { influencers } from '@/data/fanMeetingData.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import AppNav from '@/components/layout/AppNav.vue'

const router = useRouter()
const searchBarRef = ref(null)

// 인플루언서 데이터를 ref로 변환
const influencerList = ref(influencers)

const filteredInfluencers = computed(() => {
  if (!influencerList.value || !Array.isArray(influencerList.value)) {
    return []
  }
  const searchKeyword = toValue(searchBarRef.value?.keyword) || ''
  if (!searchKeyword) {
    return influencerList.value
  }
  return influencerList.value.filter(
    (influencer) =>
      influencer.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      influencer.location.toLowerCase().includes(searchKeyword.toLowerCase()),
  )
})

const goToDetail = (id) => {
  router.push(`/reservation/${id}`)
}
</script>
