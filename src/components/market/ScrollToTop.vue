<template>
  <button
    v-if="visible"
    @click="scrollTop"
    class="fixed bottom-24 right-0 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full bg-opacity-70 shadow-lg flex items-center justify-center hover:subtle-border transition"
    aria-label="Scroll to top"
  >
    <img src="@/assets/market/goToTop.svg" alt="Go to top" class="w-8 h-8 bg-opacity-70" />
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
