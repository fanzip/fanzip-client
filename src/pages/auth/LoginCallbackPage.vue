<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (code) {
    await authStore.handleKakaoLogin(code)
  }
})
</script>
<template>LoginCallbackPage</template>
