<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'
import { updateInfluencerProfile } from '@/api/influencerApi'

import CategoryEdit from '@/components/influencerMypage/edit/CategoryEdit.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const influencerStore = useInfluencerStore()

// CategoryEdit를 참조하기 위한 ref
const categoryEditRef = ref()

// 완료 버튼 클릭 시 실행되는 함수
const submitCategory = async () => {
  const selectedEnglish = categoryEditRef.value.selectedEnglishCategory
  if (selectedEnglish) {
    try {
      const influencerId = route.params.influencerId
      const updateData = {
        influencerName: influencerStore.name,
        description: influencerStore.description,
        category: selectedEnglish
      }
      
      console.log('카테고리 업데이트 요청:', {
        influencerId,
        data: updateData
      })
      
      // 서버에 카테고리 업데이트 요청 (기존 프로필 정보 포함)
      const response = await updateInfluencerProfile(influencerId, updateData)
      
      console.log('카테고리 업데이트 응답:', response)
      
      // 로컬 store 업데이트
      influencerStore.setCategory(selectedEnglish)
      
      console.log('카테고리 업데이트 성공:', selectedEnglish)
      router.back()
    } catch (error) {
      console.error('카테고리 업데이트 실패:', error)
      console.error('에러 상세:', error.response?.data)
      alert('카테고리 수정에 실패했습니다.')
    }
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
