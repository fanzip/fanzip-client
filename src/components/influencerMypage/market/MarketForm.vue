<!-- src/components/influencerMypage/market/ProductForm.vue -->
<script setup>
import { computed, ref } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import DateTimeStepper from '../fanmeeting/DateTimeStepper.vue'

import calendarIcon from '@/assets/mypage/calendar.svg'
import chevronDown from '@/assets/membership/IoChevronBackSharp.svg'
import carmera from '@/assets/mypage/camera.svg'
import vector from '@/assets/mypage/marketVector.svg'

/* ---------------------- 카테고리 모달 상태 ---------------------- */
const categoryModalOpen = ref(false)
const categoryKorean = [
  { ko: '의류', code: 'APPAREL' },
  { ko: '뷰티', code: 'BEAUTY' },
  { ko: '식품', code: 'FOOD' },
  { ko: '유아', code: 'INFANT' },
  { ko: '반려동물', code: 'PETS' },
  { ko: '가전', code: 'ELECTRONICS' },
  { ko: '가구', code: 'FURNITURE' },
  { ko: '인테리어', code: 'INTERIOR' },
  { ko: '주방', code: 'KITCHEN' },
  { ko: '스포츠/레저', code: 'SPORTS_LEISURE' },
  { ko: '자동차', code: 'AUTOMOTIVE' },
  { ko: '생활', code: 'LIFESTYLE' },
  { ko: '악기', code: 'MUSICAL_INSTRUMENTS' },
  { ko: '여행', code: 'TRAVEL' },
  { ko: '기타', code: 'OTHER' },
]

function openCategoryModal() {
  categoryModalOpen.value = true
}
function closeCategoryModal() {
  categoryModalOpen.value = false
}
function toggleCategory(name) {
  const next = [...selectedCategories.value]
  const i = next.indexOf(name)
  i >= 0 ? next.splice(i, 1) : next.push(name)
  selectedCategories.value = next
}
function removeCategory(name, e) {
  if (e) e.stopPropagation()
  selectedCategories.value = selectedCategories.value.filter((n) => n !== name)
}

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      title: '',
      price: null,
      stock: null,
      shippingFee: null,
      openAt: null,
      closeAt: null,
      descriptionImages: [],
      detailImages: [],
      selectedCategories: [],
    }),
  },
})
const emit = defineEmits(['update:modelValue'])
const patch = (p) => emit('update:modelValue', { ...props.modelValue, ...p })

/* 필드 동기화 */
const title = computed({ get: () => props.modelValue.title ?? '', set: (v) => patch({ title: v }) })
const price = computed({
  get: () => props.modelValue.price ?? null,
  set: (v) => patch({ price: v }),
})
const stock = computed({
  get: () => props.modelValue.stock ?? null,
  set: (v) => patch({ stock: v }),
})
const shippingFee = computed({
  get: () => props.modelValue.shippingFee ?? null,
  set: (v) => patch({ shippingFee: v }),
})
const openAt = computed({
  get: () => props.modelValue.openAt ?? null,
  set: (v) => {
    const close = props.modelValue.closeAt
    patch({ openAt: v, closeAt: close && close < v ? v : close })
  },
})
const closeAt = computed({
  get: () => props.modelValue.closeAt ?? null,
  set: (v) => patch({ closeAt: v }),
})

const descriptionImages = computed({
  get: () => props.modelValue.descriptionImages ?? [],
  set: (v) => patch({ descriptionImages: v }),
})
const detailImages = computed({
  get: () => props.modelValue.detailImages ?? [],
  set: (v) => patch({ detailImages: v }),
})
const selectedCategories = computed({
  get: () => props.modelValue.selectedCategories ?? [],
  set: (v) => patch({ selectedCategories: v }),
})

/* 날짜 유효성 */
const invalidRange = computed(() => openAt.value && closeAt.value && closeAt.value < openAt.value)

/* ---------------------- 업로드 공통 설정 ---------------------- */
const ACCEPT = ['image/png', 'image/jpeg', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

/* A) 상세상품 설명(여러 장) */
const descFileInput = ref(null)
const descErrorMsg = ref('')
const openDescPicker = () => descFileInput.value?.click()
const onDescDragOver = (e) => e.preventDefault()
const onDescDrop = (e) => {
  e.preventDefault()
  handleDescFiles(e.dataTransfer?.files)
}
const onDescSelect = (e) => handleDescFiles(e.target.files)
function removeDescAt(i) {
  const next = [...descriptionImages.value]
  next.splice(i, 1)
  descriptionImages.value = next
}
function handleDescFiles(files) {
  if (!files?.length) return
  descErrorMsg.value = ''
  const list = Array.from(files)
  const toAdd = []
  for (const f of list) {
    if (!ACCEPT.includes(f.type)) {
      descErrorMsg.value = 'PNG/JPEG/WEBP 형식만 가능합니다.'
      continue
    }
    if (f.size > MAX_SIZE) {
      descErrorMsg.value = '파일은 5MB 이하만 가능합니다.'
      continue
    }
    // 업로드 연동 시: const { url } = await uploadDescriptionImage(f)
    toAdd.push(URL.createObjectURL(f))
  }
  if (toAdd.length) descriptionImages.value = [...descriptionImages.value, ...toAdd]
}

/* B) 상세설명(여러 장) */
const detailFileInput = ref(null)
const detailErrorMsg = ref('')
const openDetailPicker = () => detailFileInput.value?.click()
const onDetailDragOver = (e) => e.preventDefault()
const onDetailDrop = (e) => {
  e.preventDefault()
  handleDetailFiles(e.dataTransfer?.files)
}
const onDetailSelect = (e) => handleDetailFiles(e.target.files)
function removeDetailAt(i) {
  const next = [...detailImages.value]
  next.splice(i, 1)
  detailImages.value = next
}
function handleDetailFiles(files) {
  if (!files?.length) return
  detailErrorMsg.value = ''
  const list = Array.from(files)
  const toAdd = []
  for (const f of list) {
    if (!ACCEPT.includes(f.type)) {
      detailErrorMsg.value = 'PNG/JPEG/WEBP 형식만 가능합니다.'
      continue
    }
    if (f.size > MAX_SIZE) {
      detailErrorMsg.value = '파일은 5MB 이하만 가능합니다.'
      continue
    }
    // 업로드 연동 시: const { url } = await uploadDetailImage(f)
    toAdd.push(URL.createObjectURL(f))
  }
  if (toAdd.length) detailImages.value = [...detailImages.value, ...toAdd]
}
</script>

<template>
  <div class="px-5 py-5">
    <label class="block font-semibold text-base mb-2">상품명</label>
    <input
      v-model="title"
      type="text"
      class="w-full h-11 px-4 rounded-xl border border-base-border bg-base-bg text-sm"
      placeholder="상품명을 입력해주세요(100자 이하)"
    />
  </div>

  <!-- 판매기간 -->
  <div class="px-5">
    <label class="block font-semibold text-base mb-2">판매기간</label>

    <p class="text-sm mb-2">판매 시작일</p>
    <DateTimeStepper
      v-model="openAt"
      :minute-step="30"
      :second-step="30"
      :show-seconds="true"
      placeholder="연도-월-일  --  --:--:--"
      class="mb-4"
    >
      <template #prefix><img :src="calendarIcon" alt="" class="w-4 h-4 shrink-0" /></template>
      <template #suffix><img :src="chevronDown" alt="" class="w-4 h-4 shrink-0" /></template>
    </DateTimeStepper>

    <p class="text-sm mb-2 mt-2">판매 종료일</p>
    <DateTimeStepper
      v-model="closeAt"
      :minute-step="30"
      :second-step="30"
      :show-seconds="true"
      placeholder="연도-월-일  --  --:--:--"
    >
      <template #prefix><img :src="calendarIcon" alt="" class="w-4 h-4 shrink-0" /></template>
      <template #suffix><img :src="chevronDown" alt="" class="w-4 h-4 shrink-0" /></template>
    </DateTimeStepper>

    <p v-if="invalidRange" class="mt-1 ml-4 text-xs text-red-500">
      종료일(마감 시간)은 시작일(오픈 시간) 이후여야 합니다.
    </p>
  </div>

  <div class="px-5">
    <label class="block font-semibold text-base mb-2 mt-4">상품가격</label>
    <input
      v-model="price"
      type="number"
      min="100"
      class="w-full h-11 px-4 rounded-xl border border-base-border bg-base-bg text-sm"
      placeholder="100원 이상부터 가능합니다"
    />
  </div>

  <div class="px-5">
    <label class="block font-semibold text-base mb-2 mt-4">상품재고</label>
    <input
      v-model="stock"
      type="number"
      min="1"
      class="w-full h-11 px-4 rounded-xl border border-base-border bg-base-bg text-sm"
      placeholder="최소 1개, 최대 100,000개 가능합니다"
    />
  </div>

  <!-- ✅ A) 상세상품 설명 이미지 업로드 (여러 장) -->
  <div class="px-5">
    <label class="block font-semibold text-base mb-2 mt-4">슬라이드 이미지</label>
    <div
      class="w-full rounded-xl bg-subtle-bg border border-subtle-border p-4"
      @drop="onDescDrop"
      @dragover="onDescDragOver"
    >
      <div
        v-if="!descriptionImages.length"
        class="h-36 flex flex-col items-center justify-center gap-2 cursor-pointer"
        @click="openDescPicker"
      >
        <img :src="carmera" alt="" class="w-8 h-8 opacity-80" />
        <span class="text-xs text-subtle-text">상세상품 설명 사진 등록</span>
      </div>

      <div v-else class="grid grid-cols-3 gap-2">
        <div
          v-for="(url, i) in descriptionImages"
          :key="url + i"
          class="relative rounded-lg overflow-hidden bg-base-bg"
        >
          <img :src="url" alt="" class="w-full h-28 object-cover select-none" draggable="false" />
          <button
            type="button"
            class="absolute top-1 right-1 px-2 py-0.5 rounded-md text-xs bg-base-bg/90 border"
            @click="removeDescAt(i)"
          >
            제거
          </button>
        </div>

        <!-- 제한 없음: 항상 추가 버튼 노출 -->
        <button
          type="button"
          class="h-28 border border-dashed rounded-lg flex items-center justify-center text-sm"
          @click="openDescPicker"
        >
          추가
        </button>
      </div>

      <input
        ref="descFileInput"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        @change="onDescSelect"
      />
      <p v-if="descErrorMsg" class="mt-1 text-xs text-red-500">{{ descErrorMsg }}</p>
    </div>
  </div>

  <!-- ✅ B) 상세설명 이미지 업로드 (여러 장) -->
  <div class="px-5">
    <label class="block font-semibold text-base mb-2 mt-4">상세설명 이미지</label>
    <div
      class="w-full rounded-xl bg-subtle-bg border border-subtle-border p-4"
      @drop="onDetailDrop"
      @dragover="onDetailDragOver"
    >
      <div
        v-if="!detailImages.length"
        class="h-36 flex flex-col items-center justify-center gap-2 cursor-pointer"
        @click="openDetailPicker"
      >
        <img :src="carmera" alt="" class="w-8 h-8 opacity-80" />
        <span class="text-xs text-subtle-text">상세설명 사진 등록</span>
      </div>

      <div v-else class="grid grid-cols-3 gap-2">
        <div
          v-for="(url, i) in detailImages"
          :key="url + i"
          class="relative rounded-lg overflow-hidden bg-base-bg"
        >
          <img :src="url" alt="" class="w-full h-28 object-cover select-none" draggable="false" />
          <button
            type="button"
            class="absolute top-1 right-1 px-2 py-0.5 rounded-md text-xs bg-base-bg/90 border"
            @click="removeDetailAt(i)"
          >
            제거
          </button>
        </div>

        <!-- 제한 없음: 항상 추가 버튼 노출 -->
        <button
          type="button"
          class="h-28 border border-dashed rounded-lg flex items-center justify-center text-sm"
          @click="openDetailPicker"
        >
          추가
        </button>
      </div>

      <input
        ref="detailFileInput"
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        class="hidden"
        @change="onDetailSelect"
      />
      <p v-if="detailErrorMsg" class="mt-1 text-xs text-red-500">{{ detailErrorMsg }}</p>
    </div>
  </div>

  <div class="px-5">
    <label class="block font-semibold text-base mb-2 mt-4">배송비 입력</label>
    <input
      v-model="shippingFee"
      type="number"
      min="0"
      class="w-full h-11 px-4 rounded-xl border border-base-border bg-base-bg text-sm"
      placeholder="배송비를 입력하세요"
    />
  </div>

  <div class="px-5">
    <label class="block font-semibold text-base mb-2 mt-4">카테고리 선택</label>
    <button
      type="button"
      class="relative w-full min-h-11 px-4 py-2 rounded-xl border border-base-border bg-base-bg text-sm text-left"
      @click="openCategoryModal"
    >
      <div class="flex flex-wrap items-center gap-2 pr-6">
        <template v-if="selectedCategories.length">
          <template v-for="name in selectedCategories" :key="name">
            <span class="inline-flex items-center rounded-full bg-subtle-bg px-5 py-2">{{
              name
            }}</span>
            <img
              :src="vector"
              alt="remove"
              class="w-3.5 h-3.5 cursor-pointer"
              @click.stop="removeCategory(name, $event)"
            />
          </template>
        </template>
        <span v-else class="text-subtle-text">카테고리를 선택하세요</span>
      </div>
      <img :src="chevronDown" alt="" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
    </button>
  </div>

  <!-- 카테고리 모달 (헤더 제외 회색 처리) -->
  <div
    v-if="categoryModalOpen"
    class="fixed top-12 left-0 right-0 bottom-0 bg-black bg-opacity-30 z-10 flex items-center justify-center"
    @click.self="closeCategoryModal"
  >
    <div class="w-[calc(100%-40px)] max-w-sm bg-base-bg rounded-xl shadow-xl p-4">
      <div class="flex items-center justify-between mb-3">
        <p class="font-semibold">카테고리를 선택하세요</p>
        <button class="text-sm" @click="closeCategoryModal">✕</button>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="cat in categoryKorean"
          :key="cat.code"
          type="button"
          class="h-10 rounded-xl border text-sm"
          :class="
            selectedCategories.includes(cat.ko)
              ? 'border-brand-primary ring-1 ring-brand-primary bg-base-bg text-base'
              : 'bg-base-bg border-subtle-border'
          "
          @click="toggleCategory(cat.ko)"
        >
          {{ cat.ko }}
        </button>
      </div>

      <button
        type="button"
        class="mt-4 w-full h-10 rounded-xl bg-brand-primary text-base font-semibold"
        @click="closeCategoryModal"
      >
        선택
      </button>
    </div>
  </div>
</template>
