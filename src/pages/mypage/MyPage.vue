<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import ListItem from '@/components/mypage/ListItem.vue'
import lockIcon from '@/assets/mypage/Lock.svg'
import cardIcon from '@/assets/mypage/Card.svg'
import shoppingBagIcon from '@/assets/mypage/ShoppingBag.svg'
import truckIcon from '@/assets/mypage/Truck.svg'
import logoutIcon from '@/assets/mypage/Logout.svg'
import sadFaceIcon from '@/assets/mypage/SadFace.svg'
import { useAuthStore } from '@/stores/authStore'
import { computed, onMounted, ref } from 'vue'
import userApi from '@/api/userApi'
import AppNav from '@/components/layout/AppNav.vue'
import router from '@/router'
import { getMyMembershipInfo } from '@/api/membershipApi'
import { fancardApi } from '@/api/fancardApi'

const authStore = useAuthStore()
const logout = authStore.logout
const userName = computed(() => authStore.userInfo.name)
const role = computed(() => authStore.userInfo.role)
const highestGrade = ref(null)
const cards = ref(0)

onMounted(async () => {
  const token = authStore.token
  if (token) {
    try {
      const res = await userApi.getUserInfo()
      authStore.setUserInfo(res.data)

      const res2 = await getMyMembershipInfo()
      highestGrade.value = res2.userGrade

      const response = await fancardApi.getUserFancards()
      cards.value = response.data.fancards.length
    } catch (e) {
      console.error(e)
    }
  }
})
</script>
<template>
  <AppHeader type="logo" />
  <div class="p-5 pb-20 min-h-screen bg-subtle-bg space-y-4">
    <!-- 프로필 -->
    <section class="flex items-start gap-4 bg-white p-5 mt-[48px] rounded-xl">
      <div class="flex flex-col justify-center">
        <p class="text-xl font-bold">{{ userName }}님, 안녕하세요!</p>
        <div class="flex items-center text-base">
          <p>최고등급</p>
          <p class="font-semibold ms-1">{{ highestGrade }}</p>
        </div>
      </div>
      <button
        v-if="role === 'INFLUENCER'"
        class="bg-brand-primary"
        @click.prevent="router.push({ name: 'influencers-mypage' })"
      >
        토글
      </button>
    </section>

    <section class="gap-4 flex">
      <div class="flex-1 rounded-xl p-4 flex flex-col items-center bg-white space-y-1">
        <p class="text-lg">🔥</p>
        <p class="font-semibold text-sm">보유 팬 카드</p>
        <p class="font-bold mt-1 text-lg">{{ cards }}장</p>
      </div>

      <div class="flex-1 rounded-xl p-4 flex flex-col items-center bg-white space-y-1">
        <p class="text-lg">💫</p>
        <p class="font-semibold text-sm">팬미팅 참여</p>
        <p class="font-bold mt-1 text-lg">0회</p>
      </div>

      <div class="flex-1 rounded-xl p-4 flex flex-col items-center bg-white space-y-1">
        <p class="text-lg">🛍️</p>
        <p class="font-semibold text-sm">공동 구매</p>
        <p class="font-bold mt-1 text-lg">0회</p>
      </div>
    </section>

    <div class="gap-4 bg-white pt-1 px-4 pb-6 rounded-xl">
      <router-link to="/account">
        <ListItem :src="lockIcon" menu="프로필 관리" gap="2"></ListItem
      ></router-link>
      <router-link to="/fancard">
        <ListItem :src="cardIcon" menu="멤버십 관리" gap="2"></ListItem>
      </router-link>
      <router-link to="/shipping">
        <ListItem :src="truckIcon" menu="배송지 관리" gap="2"></ListItem>
      </router-link>

      <router-link to="/my-payments">
        <ListItem :src="shoppingBagIcon" menu="결제 내역" gap="2"></ListItem
      ></router-link>

      <ListItem
        :src="logoutIcon"
        menu="로그아웃"
        @click="logout"
        gap="2"
        class="cursor-pointer"
      ></ListItem>
      <ListItem :src="sadFaceIcon" menu="회원탈퇴" gap="2" class="cursor-pointer"></ListItem>
    </div>

    <div class="bg-subtle-bg py-3">
      <div class="text-xs flex gap-5">
        <p>이용약관</p>
        <p>개인정보 처리방침</p>
      </div>
      <div class="text-sm text-subtle-text mt-6 mb-0">
        <p>COPYRIGHT © (주)좋은데요</p>
        <p>ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  </div>
  <AppNav />
</template>
