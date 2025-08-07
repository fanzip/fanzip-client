<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import NameEdit from '@/components/influencerMypage/edit/NameEdit.vue'
import { useInfluencerStore } from '@/stores/influencerStore'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { updateInfluencerProfile } from '@/api/influencerApi'

const router = useRouter()
const route = useRoute()
const influencerStore = useInfluencerStore()
const name = ref(influencerStore.name)
const isLoading = ref(false)

const handleSave = async () => {
  try {
    isLoading.value = true
    const influencerId = route.params.influencerId
    
    const profileData = {
      influencerName: name.value,
      description: influencerStore.description || '',
      category: influencerStore.category || null
    }
    
    await updateInfluencerProfile(influencerId, profileData)
    influencerStore.updateName(name.value)
    router.back()
  } catch (error) {
    console.error('이름 업데이트 실패:', error)
    alert('이름 업데이트에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <NameEdit v-model="name" class="pt-20 px-6" />

    <div class="pt-10 px-6 flex justify-center">
      <BaseButton variant="primary" size="lg" :disabled="isLoading" @click="handleSave">
        <span class="font-semibold">{{ isLoading ? '저장 중...' : '완료' }}</span>
      </BaseButton>
    </div>
  </div>
</template>
