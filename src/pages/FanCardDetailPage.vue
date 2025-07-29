<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const cardId = computed(() => route.params.id)
</script>

<template>
  <div class="w-full max-w-xs md:max-w-sm mx-auto px-4 py-10">
    <h1 class="text-xl font-bold mb-4">Fan Card Detail</h1>
    <p>카드 ID: {{ cardId }}</p>
  </div>
</template>