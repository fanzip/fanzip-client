<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 rounded-t-2">
    <div class="p-4">
      <div class="w-full max-w-[393px] mx-auto flex justify-center">
        <BaseButton 
          :variant="variant" 
          :size="size"
          :disabled="disabled"
          @click="$emit('click')"
        >
          <slot />
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue'

defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  size: {
    type: String,
    default: 'lg'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>