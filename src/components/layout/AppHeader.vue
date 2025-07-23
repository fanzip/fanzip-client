<template>
  <header
    class="w-full max-w-[393px] md:max-w-[430px] h-[48px] flex items-center px-[20px] bg-base shadow mx-auto"
  >
    <div v-if="type !== 'logo'" class="flex items-center gap-[8px]">
      <img src="@/assets/header/BackIcon.svg" alt="Back" class="cursor-pointer" />
    </div>

    <div v-else class="flex items-center">
      <img src="@/assets/header/LogoName.svg" alt="Logo" class="h-[24px]" />
    </div>

    <span
      v-if="type === 'back-title' || type === 'back-title-icons'"
      class="absolute left-1/2 transform -translate-x-1/2 text-[16px] font-semibold text-text-base"
    >
      {{ title }}
    </span>

    <div
      v-if="type === 'back-icons' || type === 'back-title-icons'"
      class="flex items-center gap-[12px] ml-auto"
    >
      <img src="@/assets/header/CartIcon.svg" alt="Cart" class="cursor-pointer hover:opacity-80" />
      <img
        src="@/assets/header/Magnifier.svg"
        alt="Search"
        class="cursor-pointer hover:opacity-80"
      />
    </div>
  </header>
</template>

<script setup>
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
</script>
