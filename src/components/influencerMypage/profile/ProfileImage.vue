<script setup>
import { useRouter } from 'vue-router'

import Ellipse from '@/assets/InfluencerProfile/Ellipse.svg'
import PlusIcon from '@/assets/InfluencerProfile/Plus.svg'

import { useInfluencerStore } from '@/stores/influencerStore'
const influencerStore = useInfluencerStore()

const router = useRouter()

const goToEditImage = () => {
  router.push('/influencer/profile/edit-image')
}
</script>

<template>
  <div class="flex justify-center mt-24">
    <div class="relative w-24 h-24">
      <!-- 프로필 이미지 -->
      <img
        :src="influencerStore.profileImage || defaultImage"
        alt="프로필 이미지"
        class="w-24 h-24 rounded-full object-cover border"
      />
      <div class="absolute bottom-0 right-0 w-6 h-6 cursor-pointer" @click="goToEditImage">
        <img :src="Ellipse" alt="버튼 배경" class="absolute w-full h-full" />
        <img :src="PlusIcon" alt="플러스" class="absolute w-3 h-3 top-1.5 left-1.5" />
      </div>
    </div>
  </div>
</template>
