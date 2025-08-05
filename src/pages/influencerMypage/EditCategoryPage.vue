<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'

import CategoryEdit from '@/components/influencerMypage/edit/CategoryEdit.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const influencerStore = useInfluencerStore()

// CategoryEdit를 참조하기 위한 ref
const categoryEditRef = ref()

// 완료 버튼 클릭 시 실행되는 함수
const submitCategory = () => {
  const selected = categoryEditRef.value.selectedCategory
  if (selected) {
    influencerStore.setCategory(selected)
    router.back()
  }
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <CategoryEdit ref="categoryEditRef" class="pt-20 px-6" />
    <div class="pt-10 px-6 flex justify-center">
      <BaseButton variant="primary" size="lg" @click="submitCategory">
        <span class="font-semibold">완료</span>
      </BaseButton>
    </div>
  </div>
</template>
