<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true },        // 부모 v-model
  address:   { type: String, default: '' },            // 장소 표시
  // 업로드 함수: (file) => Promise<{ url: string }>
  uploadPoster: {
    type: Function,
    default: async (file) =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ url: URL.createObjectURL(file) }), 600)
      ),
  },
})

const emit = defineEmits(['update:modelValue'])
const form = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

/* 포스터 업로드 상태 */
const uploading = ref(false)
const preview   = ref('')

async function onPosterChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  preview.value = URL.createObjectURL(file)
  uploading.value = true
  try {
    const { url } = await props.uploadPoster(file)
    form.value = { ...form.value, posterImageUrl: url }
  } catch (err) {
    console.error('포스터 업로드 실패', err)
  } finally {
    uploading.value = false
  }
}

function removePoster() {
  preview.value = ''
  form.value = { ...form.value, posterImageUrl: '' }
}
</script>

<template>
  <div class="w-full px-5 mb-5">
    <!-- 섹션 제목 -->
    <div class="text-base font-semibold mb-6">팬미팅 정보 입력</div>

    <!-- 장소 라인 (유지) -->
    <div class="flex items-start justify-between mb-3">
      <span class="text-base font-semibold">장소</span>
      <p class="text-sm text-base text-right leading-5 max-w-[70%]">
        {{ address }}
      </p>
    </div>

    <hr/>
    <!-- 포스터 이미지 업로드 -->
    <div class="space-y-2 mt-3">
      <label class="block font-semibold text-base">포스터 이미지</label>

      <input
        type="file"
        accept="image/*"
        @change="onPosterChange"
        class="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-base-border file:bg-subtle-bg file:px-3 file:py-2 file:text-sm file:hover:bg-subtle-bg"
      />

      <div
        v-if="preview || form.posterImageUrl"
        class="rounded-xl overflow-hidden border border-base-border"
      >
        <!-- 잘리지 않게 전체 보이기 -->
        <img
          :src="form.posterImageUrl || preview"
          alt="poster preview"
          class="w-full h-auto object-contain"
        />
      </div>

      <div v-if="preview || form.posterImageUrl" class="flex items-center gap-2">
        <button type="button" class="text-sm underline text-gray-500" @click="removePoster">
          제거
        </button>
        <p v-if="uploading" class="text-xs text-subtle-text">업로드 중...</p>
      </div>
    </div>
  </div>
</template>
