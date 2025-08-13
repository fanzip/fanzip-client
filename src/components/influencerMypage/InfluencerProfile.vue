<script setup>
import profile from '../../assets/influencer/찰스엔터프로필.svg'
import { getInfluencerProfile } from '@/api/influencerApi'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import { computed } from 'vue'
const authStore = useAuthStore()

const name = computed(() => authStore.influencerUserInfo.influencerName)
const imageUrl = computed(() => authStore.influencerUserInfo.profileImage)
</script>

<template>
  <div class="flex items-start gap-4 bg-white py-8 ps-8 mt-[48px] rounded-xl">
    <img
      :src="imageUrl"
      :alt="`${name} 프로필 이미지`"
      class="w-14 h-14 rounded-full object-cover"
    />
    <div class="flex flex-col justify-center">
      <p class="text-xl font-bold">{{ name }}님, 안녕하세요!</p>
      <p class="text-xs font-semibold text-subtle-text mt-1">
        아래에서 AI 분석 보고서를 확인하실 수 있어요!
      </p>
    </div>
  </div>
</template>
