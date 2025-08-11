<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: String, default: 'lg' },
  variant: { type: String, default: 'primary' },
  icon: { type: String, default: '' },
  type: { type: String, default: 'button' },
})

const buttonClass = computed(() => {
  const base = [
    'btn',
    'flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-xl',
    'font-semibold',
  ]

  if (props.size === 'lg') base.push('w-[353px]', 'h-12', 'text-base')
  if (props.size === 'md') base.push('w-[169px]', 'h-12', 'text-base')
  if (props.size === 'sm') base.push('w-[140px]', 'h-12', 'text-base')

  switch (props.variant) {
    case 'primary':
      base.push('bg-brand-primary', 'text-black', 'hover:bg-brand-accent')
      break
    case 'cart':
      base.push('bg-base-bg', 'text-black', 'border-2', 'border-base-border', 'hover:bg-subtle-bg')
      break
    case 'buy':
      base.push('bg-brand-primary', 'text-black', 'hover:bg-brand-accent')
      break
    case 'cancel':
      base.push('bg-nav-stroke', 'text-black')
      break
    case 'confirm':
      base.push('bg-brand-primary', 'text-black')
      break
    case 'other':
      base.push('bg-subtle-border', 'text-black')
  }

  return base
})
</script>

<template>
  <button :type="type" :class="buttonClass">
    <img v-if="icon" :src="icon" alt="icon" class="w-5 h-5" />
    <slot />
  </button>
</template>
