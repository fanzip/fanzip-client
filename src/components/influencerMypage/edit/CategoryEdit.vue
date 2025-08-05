<script setup>
import { ref } from 'vue'
import { useInfluencerStore } from '@/stores/influencerStore'

const categories = [
  '뷰티',
  '게임',
  '일상',
  '패션',
  '요리',
  '다이어트/건강',
  '반려동물',
  '키즈',
  '교육/지식',
  '여행',
  '음악',
  '운동',
  '스포츠',
  '언어',
  '기타',
]

const influencerStore = useInfluencerStore()
const selectedCategory = ref(influencerStore.category || '') // 초기값 설정

const selectCategory = (category) => {
  selectedCategory.value = category
}

defineExpose({ selectedCategory })
</script>

<template>
  <div class="w-full px-5">
    <div class="text-base font-bold mb-6">카테고리를 선택해주세요</div>

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
