<template>
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 flex flex-col items-center">
        <slot name="title">
          <h3 class="text-lg font-semibold mb-2">알림</h3>
        </slot>
        <slot>
          <p class="text-center text-base mb-5">이미 예약한 팬미팅입니다.</p>
        </slot>
        <slot name="footer">
          <button
            class="w-full py-2 mt-2 rounded-xl bg-brand-primary text-black font-semibold"
            @click="$emit('close')"
          >
            확인
          </button>
        </slot>
      </div>
    </div>
  </template>
  <script setup>
  defineEmits(['close'])
  </script>
  