<script setup>
import { useRoute } from 'vue-router'

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

const isActive = (path) => {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 w-full h-20 bg-white border-t border-[#efefef] rounded-t-2xl flex items-center justify-center z-50"
  >
    <div class="flex justify-between items-center w-full max-w-sm mx-auto px-5">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center gap-2 w-14"
        :aria-label="item.name"
      >
        <img
          :src="isActive(item.path) ? item.iconActive : item.icon"
          class="w-6 h-6"
          :alt="item.name"
        />
        <span
          :class="[
            'block text-xs leading-none text-center whitespace-nowrap transition-colors duration-200',
            isActive(item.path) ? 'text-black' : 'text-[#A7A7A7]',
          ]"
        >
          {{ item.name }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
