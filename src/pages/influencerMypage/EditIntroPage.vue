<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import IntroEdit from '@/components/influencerMypage/edit/IntroEdit.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useInfluencerStore } from '@/stores/influencerStore'
import { updateInfluencerProfile } from '@/api/influencerApi'

const router = useRouter()
const route = useRoute()
const influencerStore = useInfluencerStore()
const isLoading = ref(false)

const introEditRef = ref()

const submitIntro = async () => {
  const newIntro = introEditRef.value.intro
  if (!newIntro) {
    alert('소개글을 입력해주세요.')
    return
  }
  
  try {
    isLoading.value = true
    const influencerId = route.params.influencerId
    
    const profileData = {
      influencerName: influencerStore.name || '',
      description: newIntro,
      category: influencerStore.category || null
    }
    
    await updateInfluencerProfile(influencerId, profileData)
    influencerStore.setDescription(newIntro)
    router.back()
  } catch (error) {
    console.error('소개글 업데이트 실패:', error)
    alert('소개글 업데이트에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <IntroEdit class="pt-20 px-6" ref="introEditRef" />
    <div class="pt-10 px-6 flex justify-center">
      <BaseButton variant="primary" size="lg" :disabled="isLoading" @click="submitIntro">
        <span class="font-semibold">{{ isLoading ? '저장 중...' : '완료' }}</span>
      </BaseButton>
    </div>
  </div>
</template>
