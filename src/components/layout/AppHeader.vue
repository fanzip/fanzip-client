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

<template>
  <header class="w-full max-w-xs md:max-w-sm h-12 flex items-center ms-5">
    <div v-if="type !== 'logo'" class="flex items-center gap-2">
      <img src="@/assets/header/BackIcon.svg" alt="Back" class="cursor-pointer" />
    </div>

    <div v-else class="flex items-center">
      <img src="@/assets/header/LogoName.svg" alt="Logo" class="h-6" />
    </div>

    <span
      v-if="type === 'back-title' || type === 'back-title-icons'"
      class="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-text-base"
    >
      {{ title }}
    </span>

    <div
      v-if="type === 'back-icons' || type === 'back-title-icons'"
      class="flex items-center gap-3 ml-auto"
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
