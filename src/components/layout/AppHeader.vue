<script setup>
import { useRouter } from 'vue-router'

defineProps({
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
})

const router = useRouter()

function goBack() {
  router.go(-1)
}

function goToCart() {
  router.push('/cart')
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 w-full h-12 flex items-center px-5 bg-base-bg">
    <!-- Close 전용 -->
    <div v-if="type == 'close'" class="flex items-center">
      <img src="@/assets/header/Close.svg" alt="Close" class="cursor-pointer" />
    </div>

    <!-- Back 전용 -->
    <div v-else-if="type === 'back' || type.startsWith('back-')" class="flex items-center gap-2">
      <img src="@/assets/header/BackIcon.svg" alt="Back" class="cursor-pointer" @click="goBack" />
    </div>

    <!-- Logo 전용 -->
    <div v-else-if="type === 'logo'" class="flex items-center">
      <img src="@/assets/header/LogoName.svg" alt="Logo" class="h-6" />
    </div>

    <!-- 중앙 타이틀 -->
    <span
      v-if="type === 'back-title' || type === 'back-title-icons'"
      class="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-text-base"
    >
      {{ title }}
    </span>

    <!-- 우측 아이콘 -->
    <div
      v-if="type === 'back-icons' || type === 'back-title-icons'"
      class="flex items-center gap-2 ml-auto"
    >
      <img
        src="@/assets/header/CartIcon.svg"
        alt="Cart"
        class="cursor-pointer hover:opacity-80"
        @click="goToCart"
      />
    </div>
  </header>
</template>
