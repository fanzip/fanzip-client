<template>
  <div class="pt-[68px] mb-7 flex justify-center">
    <SearchBar ref="searchBarRef" />
  </div>
</template>

<script setup>
import SearchBar from '@/components/common/SearchBar.vue'
import { ref, defineExpose } from 'vue'

const searchBarRef = ref(null)

defineExpose({
  searchBarRef,
})
</script>
