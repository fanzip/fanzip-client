<script setup>
import { ref, computed } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import MarketThumbnail from '@/components/influencerMypage/market/MarketThumbnail.vue'
import MarketForm from '@/components/influencerMypage/market/MarketForm.vue'
import BaseButton from '@/components/common/BaseButton.vue'

// 자식이 어떤 키로 올려줘도 받도록 기본값 세팅
const form = ref({
  thumbnailUrl: '',
  title: '',
  openAt: '',
  closeAt: '',

  price: null,
  stock: null,

  // 상세/카테고리 네이밍 혼용 대응
  descImageUrl: '',
  descriptionImages: [],
  detailImages: [],
  shippingFee: null,
  selectedCategories: [],
})

// --- 통합 뷰(자식이 어떤 키를 쓰든 여기서 통일) ---
const startAt = computed(() => form.value.openAt || form.value.saleStartAt || '')
const endAt   = computed(() => form.value.closeAt || form.value.saleEndAt || '')
const catsLen = computed(
  () => (form.value.selectedCategories?.length || form.value.categories?.length || 0)
)
const dateOk = computed(() => {
  if (!startAt.value || !endAt.value) return false
  // ISO 문자열이면 문자열 비교도 가능하지만 안전하게 Date 비교
  return new Date(endAt.value) >= new Date(startAt.value)
})

// 최소 유효성 (필요시 규칙 더 추가/수정)
const isValid = computed(() => {
  const f = form.value
  return !!(
    f.thumbnailUrl &&
    f.title?.trim() &&
    startAt.value &&
    endAt.value &&
    dateOk.value &&
    Number(f.price) >= 100 &&
    Number(f.stock) >= 1 &&
    catsLen.value > 0 &&
    f.shippingFee !== null &&
    f.shippingFee !== '' &&
    !isNaN(Number(f.shippingFee))
  )
})

function submit() {
  if (!isValid.value) return
  // TODO: 제출 로직 (startAt/endAt 사용해 서버 payload 만들 것)
  // const payload = {
  //   ...form.value,
  //   openAt: startAt.value,
  //   closeAt: endAt.value,
  // }
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="상품추가" />
    <MarketThumbnail v-model="form.thumbnailUrl" />
    <MarketForm v-model="form" />

    <BaseButton
      size="lg"
      class="m-auto mt-8 mb-4"
      :disabled="!isValid"
      :class="
        !isValid
          ? 'bg-subtle-bg cursor-not-allowed pointer-events-none'
          : 'bg-primary text-base'
      "
      @click="submit"
    >
      등록완료
    </BaseButton>
  </div>
</template>
