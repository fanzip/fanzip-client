<script setup>
import Lock from '@/assets/mypage/Lock.svg'
import Card from '@/assets/mypage/Card.svg'

import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const influencerId = computed(() => authStore.influencerUserInfo.influencerId)

const menuItems = [
  {
    icon: Lock,
    label: '프로필 관리',
    action: () => router.push(`/influencers/${influencerId.value}/profile`),
  },
]
</script>

<template>
  <div>
    <div
      v-for="(item, index) in menuItems"
      :key="index"
      class="flex items-center gap-2 px-5 py-3 cursor-pointer"
      @click="item.action"
    >
      <img :src="item.icon" alt="아이콘" />
      <span class="text-base font-semibold text-black">{{ item.label }}</span>
    </div>
  </div>
</template>
