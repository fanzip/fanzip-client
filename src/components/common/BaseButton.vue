<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: String, default: 'lg' },
  variant: { type: String, default: 'primary' },
  icon: { type: String, default: '' },
  type: { type: String, default: 'button' },
})

const buttonClass = computed(() => {
  const base = ['btn', 'flex', 'items-center', 'justify-center', 'gap-2', 'rounded-[12px]', 'font-semibold']

  if (props.size === 'lg') base.push('w-[353px]', 'h-[48px]', 'text-[16px]')
  if (props.size === 'md') base.push('w-[169px]', 'h-[48px]', 'text-[16px]')
  if (props.size === 'sm') base.push('w-[140px]', 'h-[48px]', 'text-[16px]')

  switch (props.variant) {
    case 'primary':
      base.push('bg-brand-primary', 'text-black', 'hover:bg-brand-accent')
      break
    case 'cart':
      base.push('bg-white', 'text-black', 'border-2', 'border-[#EAEAEA]', 'hover:bg-subtle-bg')
      break
    case 'buy':
      base.push('bg-brand-primary', 'text-black', 'hover:bg-brand-accent')
      break
    case 'cancel':
      base.push('bg-[#EFEFEF]', 'text-black')
      break
    case 'confirm':
      base.push('bg-brand-primary', 'text-black')
      break
  }

  return base
})
</script>

<template>
  <button :type="type" :class="buttonClass">
    <img v-if="icon" :src="icon" alt="icon" class="w-[20px] h-[20px]" />
    <slot />
  </button>
</template>
