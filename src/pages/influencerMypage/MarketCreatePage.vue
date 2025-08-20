<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MarketThumbnail from '@/components/influencerMypage/market/MarketThumbnail.vue'
import MarketForm from '@/components/influencerMypage/market/MarketForm.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import marketApi from '@/api/marketApi'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const influencerId = computed(() => {
  const fromRoute = Number(route.params.id ?? route.params.influencerId)
  if (Number.isFinite(fromRoute)) return fromRoute
  const fromAuth = Number(auth?.profile?.influencerId ?? auth?.user?.influencerId)
  return Number.isFinite(fromAuth) ? fromAuth : null
})

// 폼 상태
const form = ref({
  thumbnail: '',
  title: '',
  price: null,
  discountedPrice: null,
  stock: null,
  shippingFee: null,
  openAt: null, // DTO: generalOpenTime
  closeAt: null, // 화면용
  descriptionImages: [],
  detailImages: [],
  selectedCategories: [],
})

// 카테고리 라벨 → 서버 enum 이름
const CATEGORY_CODE = {
  의류: 'APPAREL',
  뷰티: 'BEAUTY',
  식품: 'FOOD',
  유아: 'INFANT',
  반려동물: 'PETS',
  가전: 'ELECTRONICS',
  가구: 'FURNITURE',
  인테리어: 'INTERIOR',
  주방: 'KITCHEN',
  '스포츠/레저': 'SPORTS_LEISURE',
  자동차: 'AUTOMOTIVE',
  생활: 'LIFESTYLE',
  악기: 'MUSICAL_INSTRUMENTS',
  여행: 'TRAVEL',
  기타: 'OTHER',
}

// 날짜 유효성 (종료일 비교는 화면 보조용)
const hasDates = computed(() => !!(form.value.openAt && form.value.closeAt))
const dateOk = computed(
  () => !hasDates.value || new Date(form.value.closeAt) >= new Date(form.value.openAt),
)

// generalOpenTime(=openAt) 포함
const isValid = computed(() => {
  const f = form.value
  return !!(
    f.thumbnail &&
    f.title?.trim() &&
    Number(f.price) >= 100 &&
    Number(f.stock) >= 1 &&
    Number(f.shippingFee) >= 0 &&
    (f.selectedCategories?.length || 0) > 0 &&
    f.openAt &&
    dateOk.value
  )
})

const submitting = ref(false)

/**
 * 날짜 → ISO-UTC 문자열로 변환 (네트워크 전송 표준화)
 * - 입력이 Date/문자열 모두 허용
 * - 결과 예: '2025-08-20T03:00:00.000Z'
 */
const toUtcIso = (v) => (v ? new Date(v).toISOString() : null)

// 업로드 어댑터 (썸네일)
const uploadThumbnail = async (file) => {
  const { url } = await marketApi.uploadMarketThumbnail(file, influencerId.value)
  return { url }
}

// 업로드 어댑터 (슬라이드/상세)
const uploadImage = async (file, kind = 'slide') => {
  if (kind === 'detail') {
    const { urls } = await marketApi.uploadMarketDetails([file], influencerId.value)
    return { url: urls[0] }
  } else {
    const { urls } = await marketApi.uploadMarketSlides([file], influencerId.value)
    return { url: urls[0] }
  }
}

/* DTO 매핑 payload */
function buildPayload() {
  const f = form.value
  return {
    influencerId: influencerId.value,
    name: (f.title || '').trim(),
    description: '',
    price: Number(f.price),
    groupBuyPrice: null,
    discountedPrice: Number(f.discountedPrice),
    shippingPrice: Number(f.shippingFee),
    stock: Number(f.stock),
    thumbnailImage: f.thumbnail || null,
    categories: (f.selectedCategories || []).map((ko) => CATEGORY_CODE[ko]).filter(Boolean),
    detailImages: Array.isArray(f.detailImages) ? f.detailImages.filter(Boolean) : [],
    descriptionImages: Array.isArray(f.descriptionImages)
      ? f.descriptionImages.filter(Boolean)
      : [],
    generalOpenTime: toUtcIso(f.openAt),
  }
}

async function submit() {
  if (!isValid.value || submitting.value) return
  if (!Number.isFinite(influencerId.value)) {
    alert('influencerId를 확인할 수 없습니다.')
    return
  }
  submitting.value = true
  try {
    const payload = buildPayload()
    await marketApi.createProduct(payload)
    console.log('payload', payload)

    alert('상품이 등록되었습니다!')
    await router.replace('/influencers-mypage')
  } catch (err) {
    console.error('API ERROR:', {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    })
    alert(err?.response?.data?.message || err?.message || '등록 중 오류가 발생했습니다.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <AppHeader type="back-title" title="상품추가" />

    <!-- 썸네일 업로더 연결 -->
    <MarketThumbnail v-model="form.thumbnail" :uploadThumbnail="uploadThumbnail" />

    <!-- 슬라이드/상세 업로더 연결 -->
    <MarketForm v-model="form" :uploadImage="uploadImage" />

    <BaseButton
      size="lg"
      class="m-auto mt-8 mb-4"
      :disabled="!isValid || submitting"
      :class="
        !isValid || submitting
          ? 'bg-subtle-bg border-2 border-subtle-border cursor-not-allowed pointer-events-none'
          : 'bg-primary text-base'
      "
      @click="submit"
    >
      {{ submitting ? '등록 중...' : '등록' }}
    </BaseButton>
  </div>
</template>
