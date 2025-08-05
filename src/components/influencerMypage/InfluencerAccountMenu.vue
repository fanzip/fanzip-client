<script setup>
import Lock from '@/assets/mypage/Lock.svg'
import Card from '@/assets/mypage/Card.svg'
import Logout from '@/assets/mypage/Logout.svg'
import SadFace from '@/assets/mypage/SadFace.svg'

import { useRouter } from 'vue-router'

const router = useRouter()

const menuItems = [
  {
    icon: Lock,
    label: '프로필 관리',
    action: () => router.push('/influencer/profile'),
  },
  { icon: Card, label: '멤버십 관리' },
  { icon: Logout, label: '로그아웃' },
  { icon: SadFace, label: '회원탈퇴' },
]
</script>

<template>
  <div class="border-t">
    <div
      v-for="(item, index) in menuItems"
      :key="index"
      class="flex items-center gap-3 px-5 py-3 cursor-pointer"
      @click="item.action"
    >
      <img :src="item.icon" alt="아이콘" class="w-5 h-5" />
      <span class="text-base font-medium text-black">{{ item.label }}</span>
    </div>
  </div>
</template>
