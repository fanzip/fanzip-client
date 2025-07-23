<script setup>
import { useRoute } from 'vue-router'

// SVG 아이콘 import
import Home from '@/assets/Navigation/Home.svg'
import HomeActive from '@/assets/Navigation/HomeActive.svg'
import Reservation from '@/assets/Navigation/Reservation.svg'
import ReservationActive from '@/assets/Navigation/ReservationActive.svg'
import FanCard from '@/assets/Navigation/FanCard.svg'
import FanCardActive from '@/assets/Navigation/FanCardActive.svg'
import Cart from '@/assets/Navigation/Cart.svg'
import CartActive from '@/assets/Navigation/CartActive.svg'
import Person from '@/assets/Navigation/Person.svg'
import PersonActive from '@/assets/Navigation/PersonActive.svg'

const route = useRoute()

const navItems = [
  { name: '홈', path: '/', icon: Home, iconActive: HomeActive },
  { name: '예매하기', path: '/reservation', icon: Reservation, iconActive: ReservationActive },
  { name: '팬카드', path: '/fancard', icon: FanCard, iconActive: FanCardActive },
  { name: '공구마켓', path: '/market', icon: Cart, iconActive: CartActive },
  { name: '마이페이지', path: '/mypage', icon: Person, iconActive: PersonActive },
]

// 현재 path가 active인지 판단
const isActive = (path) => route.path === path
</script>
<template>
  <nav
    class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[76px] bg-white border-t border-l border-r border-[#EFEFEF] rounded-t-[16px] flex items-center justify-center z-50"
  >
    <div class="flex justify-between w-full px-[20px]">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-[8px] w-[56px]"
        :aria-label="item.name"
      >
        <img
          :src="isActive(item.path) ? item.iconActive : item.icon"
          class="w-[24px] h-[24px]"
          :alt="item.name"
        />
        <span
          :class="[
            'block text-[12px] leading-none text-center whitespace-nowrap transition-colors duration-200',
            isActive(item.path) ? 'text-black' : 'text-[#A7A7A7]',
          ]"
        >
          {{ item.name }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
