<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProfileImageEdit from '@/components/influencerMypage/edit/ProfileImageEdit.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useInfluencerStore } from '@/stores/influencerStore'

const router = useRouter()
const influencerStore = useInfluencerStore()

const imageEditRef = ref()

const submitImage = () => {
  const imageUrl = imageEditRef.value.selectedImage
  if (imageUrl) {
    influencerStore.setProfileImage(imageUrl)
  }
  router.back()
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="프로필 관리" />
    <ProfileImageEdit class="pt-20 px-6" ref="imageEditRef" />
    <div class="pt-10 px-6 flex justify-center">
      <BaseButton variant="primary" size="lg" @click="submitImage">
        <span class="font-semibold">완료</span>
      </BaseButton>
    </div>
  </div>
</template>
