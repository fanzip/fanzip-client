<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import IntroEdit from '@/components/influencerMypage/edit/IntroEdit.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useInfluencerStore } from '@/stores/influencerStore'

const router = useRouter()
const influencerStore = useInfluencerStore()

const introEditRef = ref()

const submitIntro = () => {
  const newIntro = introEditRef.value.intro
  if (!newIntro) {
    alert('소개글을 입력해주세요.')
    return
  }
  influencerStore.setDescription(newIntro)
  router.back()
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <IntroEdit class="pt-20 px-6" ref="introEditRef" />
    <div class="pt-10 px-6 flex justify-center">
      <BaseButton variant="primary" size="lg" @click="submitIntro">
        <span class="font-semibold">완료</span>
      </BaseButton>
    </div>
  </div>
</template>
