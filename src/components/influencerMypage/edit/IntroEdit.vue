<script setup>
import { ref, computed } from 'vue'

// 소개글 상태 (최대 200자)
const intro = ref('')
const introLength = computed(() => intro.value.length)
const maxLength = 200

defineExpose({ intro })
</script>

<template>
  <div class="w-full px-5">
    <!-- 제목 -->
    <div class="text-base font-bold mb-4">소개글을 작성해주세요</div>

    <!-- 입력 박스 -->
    <textarea
      v-model="intro"
      :maxlength="maxLength"
      placeholder="소개글을 입력해주세요"
      class="w-full border border-subtle-border rounded-lg p-4 text-base leading-relaxed outline-none resize-none h-32 text-text-base placeholder:text-subtle-text"
    ></textarea>

    <!-- 글자 수 표시: textarea 아래 -->
    <div class="mt-1 text-right text-sm text-subtle-text">
      {{ introLength }}/{{ maxLength }}
    </div>
  </div>
</template>
