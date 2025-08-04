<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, toValue } from 'vue'

import { useInfluencerStore } from '@/stores/influencerStore'

import SearchBar from '@/components/common/SearchBar.vue'
import InfluencerIntro from '@/components/influencer/InfluencerIntro.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import InfluencerCard from '@/components/influencer/InfluencerCard.vue'

import image1 from '../assets/influencer/레오제이.svg'
import image2 from '../assets/influencer/여단오.svg'
import image3 from '../assets/influencer/침착맨.svg'
import image4 from '../assets/influencer/침착맨2.svg'
import image5 from '../assets/influencer/토모토모.svg'
import image6 from '../assets/influencer/토모토모2.svg'
import AppNav from '@/components/layout/AppNav.vue'

const searchBarRef = ref(null)
const router = useRouter()
const influencerStore = useInfluencerStore()

const goToMembership = (influencer) => {
  influencerStore.setInfluencer(influencer) // pinia에 저장
  router.push('/membership/select') // 페이지 이동
}

const influencers = [
  {
    id: 1,
    name: '여단오',
    profileImage: image2,
    coverImage: image2,
    description:
      '안녕하세요 여단오입니다! 저희는 한중커플입니다.\n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 2,
    name: '침착맨',
    profileImage: image3,
    coverImage: image3,
    description:
      '안녕하세요 침착맨입니다!\n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 3,
    name: '토모토모',
    profileImage: image5,
    coverImage: image5,
    description:
      '안녕하세요 토모토모입니다! 저희는 한일커플입니다.\n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 4,
    name: '레오제이',
    profileImage: image1,
    coverImage: image1,
    description:
      '안녕하세요 레오제이입니다! 저희는 한중커플입니다.\n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 5,
    name: '침착맨',
    profileImage: image4,
    coverImage: image4,
    description:
      '안녕하세요 침착맨입니다!\n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 6,
    name: '침착맨',
    profileImage: image4,
    coverImage: image4,
    description:
      '안녕하세요 침착맨입니다!\n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 7,
    name: '레오제이',
    profileImage: image6,
    coverImage: image6,
    description:
      '안녕하세요 레오제이입니다! \n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 8,
    name: '레오제이',
    profileImage: image6,
    coverImage: image6,
    description:
      '안녕하세요 레오제이입니다! \n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 9,
    name: '레오제이',
    profileImage: image6,
    coverImage: image6,
    description:
      '안녕하세요 레오제이입니다! 저희는 한중커플입니다.\n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
  {
    id: 10,
    name: '레오제이',
    profileImage: image6,
    coverImage: image6,
    description:
      '안녕하세요 레오제이입니다! 저희는 한중커플입니다.\n2025/08/12 팬미팅에서 만나요~ヾ(^▽^*)))\n2025/08/15 공구마켓도 기대해주세요!',
  },
]

const filteredInfluencers = computed(() => {
  const keyword = toValue(searchBarRef.value?.keyword) || ''
  if (!keyword) return influencers
  return influencers.filter((influencer) =>
    influencer.name.toLowerCase().includes(keyword.toLowerCase()),
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
            :key="influencer.id"
            :id="influencer.id"
            :name="influencer.name"
            :profileImage="influencer.profileImage"
            :coverImage="influencer.coverImage"
            @click="goToMembership(influencer)"
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
