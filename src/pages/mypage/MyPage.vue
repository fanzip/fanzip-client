<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import ListItem from '@/components/mypage/ListItem.vue'
import { useAuthStore } from '@/stores/authStore'
import { computed, onMounted } from 'vue'
import userApi from '@/api/userApi'
import AppNav from '@/components/layout/AppNav.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import router from '@/router'

const authStore = useAuthStore()
const logout = authStore.logout
const userName = computed(() => authStore.userInfo.name)
const role = computed(() => authStore.userInfo.role)
onMounted(async () => {
  const token = authStore.token
  if (token) {
    try {
      const res = await userApi.getUserInfo()
      authStore.setUserInfo(res.data)
    } catch (e) {
      console.error(e)
    }
  }
})
</script>
<template>
  <div class="w-full flex flex-col">
    <AppHeader type="logo" />
    <div class="mt-12 flex justify-between">
      <div>
        <p class="text-xl font-bold ms-5">{{ userName }}님, 안녕하세요!</p>
        <div class="flex justify-between ms-5 w-32">
          <p class="text-xl">최고등급</p>
          <p class="text-xl font-bold">GOLD</p>
        </div>
      </div>
      <BaseButton
        v-if="role === 'INFLUENCER'"
        variant="buy"
        size="sm"
        @click.prevent="router.push({ name: 'influencers-mypage' })"
        >인플루언서 페이지로 이동</BaseButton
      >
    </div>
    <div class="border border-subtle-border mt-6"></div>
    <div class="mt-4 mb-4">
      <p class="font-bold ms-5">나의 참여</p>
      <div class="flex justify-between text-center bg-subtle-bg rounded-lg mx-5 mt-2 p-2">
        <div class="flex-1">
          <p class="font-semibold text-sm">보유 팬 카드 수</p>
          <p class="font-bold mt-1">9</p>
        </div>
        <div class="w-px bg-gray-300 mx-2"></div>
        <div class="flex-1">
          <p class="font-semibold text-sm">팬미팅 참여 횟수</p>
          <p class="font-bold mt-1">3</p>
        </div>
        <div class="w-px bg-gray-300 mx-2"></div>
        <div class="flex-1">
          <p class="font-semibold text-sm">공동 구매 횟수</p>
          <p class="font-bold mt-1">7</p>
        </div>
      </div>
    </div>
    <div class="border border-subtle-border"></div>
    <div class="mb-16">
      <router-link to="/account">
        <ListItem src="/src/assets/mypage/Lock.svg" menu="계정 관리" gap="2"></ListItem
      ></router-link>
      <router-link to="/fancard">
        <ListItem src="/src/assets/mypage/Card.svg" menu="멤버십 관리" gap="2"></ListItem>
      </router-link>
      <router-link to="/my-payments">
        <ListItem src="/src/assets/mypage/ShoppingBag.svg" menu="결제 내역" gap="2"></ListItem
      ></router-link>

      <router-link to="/shipping">
        <ListItem src="/src/assets/mypage/Truck.svg" menu="배송지 관리" gap="2"></ListItem>
      </router-link>

      <ListItem
        src="/src/assets/mypage/Logout.svg"
        menu="로그아웃"
        @click="logout"
        gap="2"
      ></ListItem>
      <ListItem src="/src/assets/mypage/SadFace.svg" menu="회원탈퇴" gap="3"></ListItem>
    </div>

    <div class="bg-subtle-bg pt-3 px-5 pb-20">
      <div class="text-xs flex gap-5">
        <p>이용약관</p>
        <p>개인정보 처리방침</p>
      </div>
      <div class="text-sm text-subtle-text mt-24 mb-0">
        <p>COPYRIGHT © (주)좋은데요</p>
        <p>ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  </div>
  <AppNav />
</template>
