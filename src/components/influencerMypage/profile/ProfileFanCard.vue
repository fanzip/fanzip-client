<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useInfluencerStore } from '@/stores/influencerStore'
import Icon from '@/assets/membership/Vector.svg'


const router = useRouter()
const route = useRoute()
const influencerStore = useInfluencerStore()

const goToEditFanCard = () => {
  const influencerId = route.params.influencerId
  router.push(`/influencers/${influencerId}/profile/edit-fancard`)
}
</script>

<template>
  <div class="px-5 mt-6 mb-6 space-y-2">
    <!-- 타이틀 + 아이콘 (기존 그대로) -->
    <div class="flex items-center justify-between cursor-pointer" @click="goToEditFanCard">
      <span class="text-base font-medium">팬카드 이미지</span>
      <img :src="Icon" alt=">" class="w-3 h-3 rotate-180" />
    </div>

    <!-- 이미지 박스: 이미지 없으면 등록 박스 표시 -->
    <div
      class="w-full h-56 overflow-hidden rounded-md border border-subtle-border
             bg-gray-50 flex items-center justify-center"
      @click="goToEditFanCard"
    >
      <!-- 이미지가 있을 때 (기존 img 유지) -->
      <img
        v-if="influencerStore.fanCardImage"
        :src="influencerStore.fanCardImage"
        class="w-full h-full object-cover"
        alt="팬카드 이미지"
        @error="influencerStore.setFanCardImage('')" 
      />

      <!-- 이미지가 없을 때: 등록 박스만 추가 -->
      <div
        v-else
        class="px-4 py-2 text-sm text-subtle-text bg-base-bg border subtle-border rounded shadow"
      >
        팬카드 이미지 등록
      </div>
    </div>
  </div>
</template>
