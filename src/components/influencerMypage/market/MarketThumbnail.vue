<script setup>
import { ref, computed, watch } from 'vue'
import imageIcon from '@/assets/mypage/imageIcon.svg'

const props = defineProps({
  modelValue: { type: [String, Object], default: '' },
  uploadThumbnail: { type: Function, default: null },
})
const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)

const getUrlFromModel = (mv) =>
  (typeof mv === 'object' && mv !== null) ? (mv.imageUrl || '') : (mv || '')

const previewUrl = ref(getUrlFromModel(props.modelValue))
const fileName = ref('')
const uploading = ref(false)
const errorMsg = ref('')
const hasImage = computed(() => !!previewUrl.value)

watch(() => props.modelValue, (nv) => {
  previewUrl.value = getUrlFromModel(nv)
})

function setImage(url) {
  previewUrl.value = url
  if (typeof props.modelValue === 'object' && props.modelValue !== null) {
    emit('update:modelValue', { ...props.modelValue, imageUrl: url })
  } else {
    emit('update:modelValue', url)
  }
}

async function handleFile(file) {
  errorMsg.value = ''
  if (!file) return

  const accept = ['image/png', 'image/jpeg', 'image/webp']
  if (!accept.includes(file.type)) {
    errorMsg.value = 'PNG/JPEG/WEBP 형식만 업로드 가능합니다.'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMsg.value = '파일 크기는 5MB 이하만 가능합니다.'
    return
  }

  uploading.value = true
  try {
    if (props.uploadThumbnail) {
      const { url } = await props.uploadThumbnail(file) // 실제 업로드
      setImage(url)
    } else {
      const localUrl = URL.createObjectURL(file) // 데모용 로컬 미리보기
      setImage(localUrl)
    }
    fileName.value = file.name
  } catch (e) {
    console.error(e)
    errorMsg.value = '업로드 중 오류가 발생했습니다.'
  } finally {
    uploading.value = false
  }
}

const openPicker = () => fileInput.value?.click()
const onSelect = (e) => handleFile(e.target.files?.[0])
const onDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer?.files?.[0]) }
const onDragOver = (e) => e.preventDefault()
const clearImage = () => {
  setImage('')
  fileName.value = ''
  errorMsg.value = ''
}
</script>

<template>
  <div class="mt-16">
    <!-- 헤더 텍스트 (좌측 정렬 + 동일 여백) -->
    <div class="px-5">
      <div class="text-base font-semibold mb-2">상품정보 입력</div>
      <div class="text-xs text-subtle-text mb-4">상품 정보는 등록 이후 수정이 불가합니다.</div>
    </div>

    <!-- 업로드 영역 -->
    <div
      class="relative w-full max-w-full rounded-xl overflow-hidden bg-subtle-bg"
      @drop="onDrop"
      @dragover="onDragOver"
    >
      <!-- 정사각 캔버스 -->
      <div
        class="w-full aspect-square"
        :class="hasImage ? '' : 'flex flex-col items-center justify-center gap-2 cursor-pointer'"
        @click="!hasImage && !uploading ? openPicker() : null"
        @keydown.enter.prevent="!hasImage && !uploading ? openPicker() : null"
        @keydown.space.prevent="!hasImage && !uploading ? openPicker() : null"
        role="button"
        tabindex="0"
        aria-label="썸네일 이미지 업로드"
      >
        <!-- 이미지가 있을 때 -->
        <img
          v-if="hasImage"
          :src="previewUrl"
          alt="thumbnail"
          class="w-full h-full object-cover"
          draggable="false"
        />

        <!-- 없는 상태: 가운데 버튼 + 안내문 -->
        <template v-else>
          <button
            type="button"
            class="inline-flex items-center justify-center px-12 py-2 rounded-lg border text-sm bg-base-bg border-subtle-border"
            :disabled="uploading"
          >
            <img :src="imageIcon" alt="아이콘" class="w-4 h-4 mr-1" />
            썸네일 이미지 등록
          </button>
          <p class="text-xs text-subtle-text text-center">정사각 이미지로 등록해 주세요</p>
        </template>
      </div>

      <!-- 선택/제거 액션 (이미지 있을 때만 노출) -->
      <div v-if="hasImage" class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border text-sm bg-white/90"
          @click="openPicker"
          :disabled="uploading"
        >
          다시 선택
        </button>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg border text-sm bg-white/90"
          @click="clearImage"
          :disabled="uploading"
        >
          제거
        </button>
      </div>
    </div>

    <!-- 파일 입력 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      class="hidden"
      @change="onSelect"
    />

    <!-- 에러 메시지 -->
    <p v-if="errorMsg" class="mt-1 text-xs text-red-500 px-5">
      {{ errorMsg }}
    </p>
  </div>
</template>
