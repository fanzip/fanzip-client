<script setup>
import { useRouter } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'
import Icon from '@/assets/membership/Vector.svg'
import defaultFanCardImage from '@/assets/influencer/찰스엔터팬카드.svg'

const router = useRouter()
const influencerStore = useInfluencerStore()

const goToEditFanCard = () => {
  router.push('/influencer/profile/edit-fancard')
}
</script>

<template>
  <div class="px-5 mt-6 mb-6 space-y-2">
    <!-- 타이틀 + 아이콘 -->
    <div class="flex items-center justify-between cursor-pointer" @click="goToEditFanCard">
      <span class="text-sm text-base">팬카드 이미지</span>
      <img :src="Icon" alt=">" class="w-3 h-3 rotate-180" />
    </div>

    <!-- 이미지 박스 -->
    <div class="w-full h-56 overflow-hidden rounded-md border border-subtle-border">
      <img
        :src="influencerStore.fanCardImage || defaultFanCardImage"
        class="w-full h-full object-cover"
        alt="팬카드 이미지"
      />
    </div>
  </div>
</template>
