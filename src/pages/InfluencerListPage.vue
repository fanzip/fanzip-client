<script setup>
import { ref, computed, toValue, onMounted } from 'vue'

import influencerApi from '@/api/influencerApi' // ✅ API import

import SearchBar from '@/components/common/SearchBar.vue'
import InfluencerIntro from '@/components/influencer/InfluencerIntro.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import InfluencerCard from '@/components/influencer/InfluencerCard.vue'
import AppNav from '@/components/layout/AppNav.vue'
import userApi from '@/api/userApi'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const searchBarRef = ref(null)

const influencers = ref([]) // ✅ 목 데이터 대신 API 데이터 담을 ref

onMounted(async () => {
  try {
    const res = await userApi.getUserInfo()
    authStore.setUserInfo(res.data)
  } catch (e) {
    console.error(e)
  }
  try {
    const data = await influencerApi.fetchAll()
    influencers.value = data
  } catch (e) {
    console.error('인플루언서 목록 불러오기 실패', e)
  }
})
// ✅ 검색 필터
const filteredInfluencers = computed(() => {
  const keyword = toValue(searchBarRef.value?.keyword) || ''
  if (!keyword) return influencers.value
  return influencers.value.filter((influencer) =>
    influencer.influencerName.toLowerCase().includes(keyword.toLowerCase()),
  )
})
</script>

<template>
  <div class="bg-base-bg min-h-screen flex flex-col">
    <AppHeader type="logo" />
    <InfluencerIntro />
    <SearchBar ref="searchBarRef" class="mb-1" />

    <div class="bg-subtle-bg p-2 flex-grow">
      <template v-if="filteredInfluencers.length > 0">
        <div class="grid grid-cols-2 gap-4 mt-2 w-fit mx-auto pb-20">
          <InfluencerCard
            v-for="influencer in filteredInfluencers"
            :key="influencer.influencerId"
            :id="influencer.influencerId"
            :name="influencer.influencerName"
            :profileImage="influencer.profileImage"
            :coverImage="influencer.profileImage"
            :description="influencer.description"
          />
        </div>
      </template>

      <template v-else>
        <div class="flex justify-center items-center h-60">
          <p class="text-gray-400 text-base">검색 결과가 없습니다.</p>
        </div>
      </template>
    </div>
    <AppNav />
  </div>
</template>
