<script setup>
import Logout from '@/assets/mypage/Logout.svg'
import SadFace from '@/assets/mypage/SadFace.svg'
import { useAuthStore } from '@/stores/authStore'

const logout = useAuthStore().logout
const menuItems = [
  { icon: Logout, label: '로그아웃', action: logout },
  { icon: SadFace, label: '회원탈퇴' },
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
      <img :src="item.icon" alt="아이콘" class="w-5 h-5" />
      <span class="text-base font-semibold text-black">{{ item.label }}</span>
    </div>
  </div>
</template>
