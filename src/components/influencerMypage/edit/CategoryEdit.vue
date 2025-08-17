<script setup>
import { ref } from 'vue'
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

const categories = Object.values(categoryMapping)

const influencerStore = useInfluencerStore()
const selectedCategory = ref(categoryMapping[influencerStore.category] || '') // 초기값 설정

const selectCategory = (category) => {
  selectedCategory.value = category
}

const getEnglishCategory = (koreanCategory) => {
  return Object.keys(categoryMapping).find((key) => categoryMapping[key] === koreanCategory)
}

defineExpose({
  selectedCategory,
  get selectedEnglishCategory() {
    return getEnglishCategory(selectedCategory.value)
  },
})
</script>

<template>
  <div class="w-full px-5">
    <div class="text-lg font-bold mb-6">카테고리를 선택해주세요</div>

    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        :class="[
          'py-2 px-3 rounded-lg text-sm border text-center',
          selectedCategory === category
            ? 'text-base border-brand-accent font-semibold'
            : 'bg-base-bg text-base border-base-border',
        ]"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>
