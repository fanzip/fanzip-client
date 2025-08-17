<script setup>
import Icon from '@/assets/membership/Vector.svg'
import { useRouter, useRoute } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'

const categoryMapping = {
  BEAUTY: '뷰티',
  GAME: '게임',
  DAILY: '일상',
  FASHION: '패션',
  COOKING: '요리',
  HEALTH: '다이어트/건강',
  PET: '반려동물',
  KIDS: '키즈',
  EDUCATION: '교육/지식',
  TRAVEL: '여행',
  MUSIC: '음악',
  FITNESS: '운동',
  SPORTS: '스포츠',
  LANGUAGE: '언어',
  ETC: '기타',
}

const getCategoryDisplayName = (category) => {
  return categoryMapping[category] || category || ''
}

const router = useRouter()
const route = useRoute()
const influencerStore = useInfluencerStore()

const goToEditName = () => {
  const influencerId = route.params.influencerId
  router.push(`/influencers/${influencerId}/profile/edit-name`)
}

const goToEditCategory = () => {
  const influencerId = route.params.influencerId
  router.push(`/influencers/${influencerId}/profile/edit-category`)
}

const goToEditIntro = () => {
  const influencerId = route.params.influencerId
  router.push(`/influencers/${influencerId}/profile/edit-intro`)
}
</script>

<template>
  <div class="px-5 space-y-4 mt-8">
    <!-- 이름 -->
    <div class="flex items-center justify-between">
      <span class="text-base font-medium">활동명</span>
      <div class="flex items-center gap-1">
        <span class="text-base">{{ influencerStore.name }}</span>
        <img
          :src="Icon"
          alt=">"
          class="w-3 h-3 rotate-180 ml-2 cursor-pointer"
          @click="goToEditName"
        />
      </div>
    </div>

    <!-- 카테고리 -->
    <div class="flex items-center justify-between">
      <span class="text-base font-medium">카테고리</span>
      <div class="flex items-center gap-1">
        <span class="text-base">{{ getCategoryDisplayName(influencerStore.category) }}</span>
        <img
          :src="Icon"
          alt=">"
          class="w-3 h-3 rotate-180 ml-2 cursor-pointer"
          @click="goToEditCategory"
        />
      </div>
    </div>

    <!-- 소개글 -->
    <div>
      <div class="flex justify-between items-start mb-4">
        <span class="text-base font-medium">소개글</span>
        <img :src="Icon" alt=">" class="w-3 h-3 rotate-180 cursor-pointer" @click="goToEditIntro" />
      </div>
      <div class="border border-subtle-border rounded-lg px-4 py-3 text-base h-36">
        {{ influencerStore.description || '소개글이 없습니다.' }}
      </div>
    </div>
  </div>
</template>
