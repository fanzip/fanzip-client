<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import FanCardEdit from '@/components/influencerMypage/edit/FanCardEdit.vue'
import BaseButton from '@/components/common/BaseButton.vue'

import { useInfluencerStore } from '@/stores/influencerStore'

const fanCardEditRef = ref()
const router = useRouter()
const influencerStore = useInfluencerStore()

const submitFanCard = () => {
  const image = fanCardEditRef.value.selectedImage
  if (image) {
    influencerStore.setFanCardImage(image)
  }
  router.back()
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <FanCardEdit class="pt-20 px-6" ref="fanCardEditRef" />
    <div class="pt-10 px-6 flex justify-center">
      <BaseButton variant="primary" size="lg" class="w-full" @click="submitFanCard">
        <span class="font-semibold">완료</span>
      </BaseButton>
    </div>
  </div>
</template>
