<template>
  <div class="min-h-screen bg-subtle-bg text-text-base font-sans">
    <!-- Top -->
    <header
      class="sticky top-0 z-10 bg-base-bg/90 backdrop-blur border-b border-nav-stroke"
      style="padding-top: env(safe-area-inset-top)"
    >
      <div class="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        <h1 class="text-lg font-bold">관리자 · 인플루언서 심사 관리</h1>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-5 py-6 space-y-5">
      <!-- 필터 탭 -->
      <div class="bg-base-bg rounded-2xl shadow-sm border border-subtle-border p-3">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
          <button
            class="btn h-8 px-2.5 text-sm whitespace-nowrap shrink-0 w-auto flex-none"
            :class="filterStatus === null ? 'btn-primary' : ''"
            @click="setFilter(null)"
          >
            전체
          </button>
          <button
            class="btn h-8 px-2.5 text-sm whitespace-nowrap shrink-0 w-auto flex-none"
            :class="filterStatus === 'PENDING' ? 'btn-primary' : ''"
            @click="setFilter('PENDING')"
          >
            대기중
          </button>
          <button
            class="btn h-8 px-2.5 text-sm whitespace-nowrap shrink-0 w-auto flex-none"
            :class="filterStatus === 'APPROVED' ? 'btn-primary' : ''"
            @click="setFilter('APPROVED')"
          >
            승인됨
          </button>
          <button
            class="btn h-8 px-2.5 text-sm whitespace-nowrap shrink-0 w-auto flex-none"
            :class="filterStatus === 'REJECTED' ? 'btn-primary' : ''"
            @click="setFilter('REJECTED')"
          >
            반려됨
          </button>

          <div class="ml-auto flex items-center gap-2 shrink-0">
            
          </div>
        </div>
      </div>

      <!-- 목록 영역 -->
      <div class="bg-base-bg rounded-2xl shadow-sm border border-subtle-border">
        <!-- 상단 툴바: 총 건수 -->
        <div class="px-4 py-3 flex items-center gap-2 border-b border-subtle-border">
          <div class="text-md text-subtle-text whitespace-nowrap mr-3">
            총 <span class="font-semibold">{{ total }}</span
            >건
          </div>
          <div class="relative w-72 sm:w-64">
              <input
                v-model.trim="q"
                @input="onSearch"
                placeholder="닉네임/이메일 검색"
                aria-label="닉네임/이메일 검색"
                class="input h-8 pl-9 pr-8 w-full text-sm"
              />
            </div>
        </div>
        

        <!-- 헤더(데스크탑) -->
        <div class="hidden md:grid grid-cols-12 px-4 py-3 text-xs text-subtle-text">
          <div class="col-span-3">신청자</div>
          <div class="col-span-2">카테고리</div>
          <div class="col-span-3">SNS</div>
          <div class="col-span-2">신청일</div>
          <div class="col-span-2 text-right">상태/액션</div>
        </div>

        <!-- 로딩 -->
        <div v-if="loading" class="p-6">
          <div class="animate-pulse space-y-3">
            <div class="h-4 bg-subtle-bg rounded"></div>
            <div class="h-4 bg-subtle-bg rounded w-2/3"></div>
            <div class="h-4 bg-subtle-bg rounded w-1/3"></div>
          </div>
        </div>

        <!-- 빈 상태 -->
        <div v-else-if="!reviews.length" class="p-10 text-center text-sm text-subtle-text">
          조건에 해당하는 심사 신청이 없습니다.
        </div>

        <!-- 리스트 -->
        <div v-else class="divide-y divide-subtle-border">
          <div
            v-for="r in reviews"
            :key="r.reviewId"
            class="px-4 py-4 md:grid md:grid-cols-12 md:items-center gap-3"
          >
            <!-- 신청자 -->
            <div class="md:col-span-3">
              <div class="font-semibold">{{ r.nickname }}</div>
              <div class="text-xs text-subtle-text break-words">
                {{ r.userName }} 
              </div>
            </div>

            <!-- 카테고리 -->
            <div class="md:col-span-2 mt-2 md:mt-0">
              <span
                class="inline-flex items-center h-6 px-2.5 rounded-full border text-[11px]"
                :class="categoryPillCls"
              >
                {{ categoryLabel(r.category) }}
              </span>
            </div>

            <!-- SNS -->
            <div class="md:col-span-3 mt-2 md:mt-0 break-words">
              <a
                v-if="r.snsLink"
                :href="r.snsLink"
                target="_blank"
                rel="noopener"
                class="underline"
              >
                {{ r.snsLink }}
              </a>
              <span v-else class="text-subtle-text text-xs">-</span>
              <div class="hidden md:block text-xs text-subtle-text line-clamp-1 mt-1">
                {{ r.intro || '' }}
              </div>
            </div>

            <!-- 신청일 -->
            <div class="md:col-span-2 mt-2 md:mt-0 text-sm text-subtle-text">
              {{ r.appliedAt }}
            </div>

            <!-- 상태 & 액션 -->
            <div class="md:col-span-2 mt-3 md:mt-0 flex md:justify-end gap-2">
              <span
                class="inline-flex items-center h-6 px-2.5 rounded-full border text-[11px]"
                :class="statusPillClass(r.status)"
              >
                {{ statusK(r.status) }}
              </span>

              <button class="btn h-8 px-3 text-sm" @click="openDetail(r)">상세</button>

              <!-- PENDING: 승인/거절 -->
              <template v-if="r.status === 'PENDING'">
                <button
                  class="btn btn-primary h-8 px-3 text-sm w-auto flex-none"
                  @click="approveReview(r)"
                >
                  승인
                </button>
                <button class="btn h-9 px-4 text-sm w-auto flex-none bg-subtle-bg text-text-base border-subtle-border hover:bg-subtle-border" @click="openReject(r)">반려</button>
              </template>

              <!-- APPROVED/REJECTED: 롤백(승인취소/거절취소) -->
              <template v-else>
                <button class="btn h-8 px-3 text-sm" @click="revertToPending(r)">
                  {{ r.status === 'APPROVED' ? '승인취소' : '거절취소' }}
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div
          class="flex items-center justify-between px-4 py-3 border-t border-subtle-border text-sm pb-[env(safe-area-inset-bottom)]"
        >
          <div class="text-subtle-text">총 {{ total }}건</div>
          <div class="flex items-center gap-2">
            <button class="btn h-8 px-3" @click="resetMockData">이전</button>
            <span class="text-subtle-text">{{ page }} / {{ totalPages }}</span>
            <button class="btn h-8 px-3" :disabled="page === totalPages" @click="go(page + 1)">
              다음
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 상세 패널 -->
    <div v-if="detail" class="fixed inset-0 z-20">
      <div class="absolute inset-0 bg-black/30" @click="detail = null"></div>
      <div
        class="absolute right-0 top-0 bottom-0 w-full sm:w-[30rem] bg-base-bg shadow-xl border-l border-subtle-border p-5 overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">신청 상세</h3>
          <button class="btn h-8 px-3" @click="detail = null">닫기</button>
        </div>
        <div class="space-y-3 text-sm">
          <div><span class="text-subtle-text">닉네임</span> · {{ detail.nickname }}</div>
          <div>
            <span class="text-subtle-text">사용자</span> · {{ detail.userName }}
          </div>
          <div>
            <span class="text-subtle-text">카테고리</span> · {{ categoryLabel(detail.category) }}
          </div>
          <div>
            <span class="text-subtle-text">SNS</span> ·
            <a
              v-if="detail.snsLink"
              :href="detail.snsLink"
              target="_blank"
              rel="noopener"
              class="underline"
              >{{ detail.snsLink }}</a
            >
            <span v-else>-</span>
          </div>
          <div><span class="text-subtle-text">신청일</span> · {{ detail.appliedAt }}</div>
          <div>
            <div class="text-subtle-text mb-1">소개</div>
            <div class="rounded-xl border border-subtle-border p-3 whitespace-pre-wrap">
              {{ detail.intro || '-' }}
            </div>
          </div>
          <div>
            <div class="text-subtle-text mb-1">상태</div>
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center h-6 px-2.5 rounded-full border text-[11px]"
                :class="statusPillClass(detail.status)"
              >
                {{ statusK(detail.status) }}
              </span>
              <div v-if="detail.reviewedAt" class="text-xs text-subtle-text">
                · {{ detail.reviewedAt }}
              </div>
            </div>
          </div>

          <!-- 상세 패널 액션 -->
          <div class="pt-2 flex justify-end gap-2">
            <template v-if="detail.status === 'PENDING'">
              <button
                class="btn btn-primary text-sm h-9 px-4 w-auto flex-none"
                @click="approveReview(detail)"
              >
                승인
              </button>
              <button
                class="btn h-9 px-4 text-sm w-auto flex-none bg-subtle-bg text-text-base border-subtle-border hover:bg-subtle-border"
                @click="openReject(detail)"
              >
                반려
              </button>
            </template>
            <template v-else>
              <button class="btn h-9 px-4" @click="revertToPending(detail)">
                {{ detail.status === 'APPROVED' ? '승인취소' : '거절취소' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- 반려 모달 -->
    <div v-if="rejectModal.show" class="fixed inset-0 z-30">
      <div class="absolute inset-0 bg-black/30" @click="closeReject"></div>
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div
          class="bg-base-bg rounded-2xl border border-subtle-border shadow-xl w-full max-w-md p-5"
        >
          <h3 class="text-lg font-bold mb-3">반려 사유 입력</h3>
          <textarea
            v-model.trim="rejectModal.message"
            class="input min-h-28 w-full"
            placeholder="반려 사유를 입력해주세요"
          ></textarea>
          <div class="mt-4 flex justify-end gap-2">
            <button class="btn h-9 px-4" @click="closeReject">취소</button>
            <button
              class="btn h-9 px-4 text-sm w-auto flex-none bg-subtle-bg text-text-base border-subtle-border hover:bg-subtle-border"
              @click="confirmReject"
              :disabled="!rejectModal.message"
            >
              반려
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { listReviews, decideReview, ensureMockSeed, resetMock } from '@/api/reviewAdminApi.js'

const USE_MOCK = true // 실서버 붙이면 false 로 변경

const loading = ref(false)
const reviews = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(10)
const filterStatus = ref(null) // null | 'PENDING' | 'APPROVED' | 'REJECTED'
const q = ref('')

const detail = ref(null)
const rejectModal = ref({ show: false, target: null, message: '' })

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size.value)))

function statusK(s) {
  return s === 'PENDING' ? '대기중' : s === 'APPROVED' ? '승인됨' : s === 'REJECTED' ? '거절됨' : s
}
function statusPillClass(s) {
  if (s === 'PENDING') return 'bg-brand-primary/10 border-brand-primary/30 text-nav-active'
  if (s === 'APPROVED') return 'bg-green-50 border-green-200 text-green-700'
  if (s === 'REJECTED') return 'bg-red-50 border-red-200 text-red-700'
  return 'bg-subtle-bg border-subtle-border text-subtle-text'
}
const categoryPillCls = 'bg-subtle-bg border-subtle-border text-subtle-text'

function categoryLabel(v) {
  const map = {
    BEAUTY: '뷰티',
    GAME: '게임',
    DAILY: '일상',
    FASHION: '패션',
    COOKING: '요리',
    HEALTH: '다이어트/건강',
    PET: '반려동물',
    KIDS: '키즈',
    EDUCATION: '교육/지식',
    TRAVEL: '여행',
    MUSIC: '음악',
    FITNESS: '운동',
    SPORTS: '스포츠',
    LANGUAGE: '언어',
    ETC: '기타',
  }
  return map[v] || v
}

async function fetchReviews() {
  loading.value = true
  try {
    if (USE_MOCK) {
      const { items, total: t } = await listReviews({
        page: page.value,
        size: size.value,
        status: filterStatus.value || undefined,
        q: q.value || undefined,
      })
      reviews.value = items
      total.value = t
    } else {
      const params = new URLSearchParams()
      params.set('page', page.value)
      params.set('size', size.value)
      if (filterStatus.value) params.set('status', filterStatus.value)
      if (q.value) params.set('q', q.value)
      const res = await fetch(`/api/review/admin/list?${params.toString()}`, {
        credentials: 'include',
      })
      const data = await res.json()
      reviews.value = Array.isArray(data) ? data : data.items || []
      total.value = Array.isArray(data) ? data.length : (data.total ?? reviews.value.length)
    }
  } catch (e) {
    console.error(e)
    reviews.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function setFilter(s) {
  filterStatus.value = s
  page.value = 1
  fetchReviews()
}

let searchTimer
function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    fetchReviews()
  }, 200)
}
function refresh() {
  fetchReviews()
}
function go(p) {
  page.value = Math.min(Math.max(1, p), totalPages.value)
  fetchReviews()
}

function openDetail(r) {
  detail.value = r
}
function openReject(r) {
  rejectModal.value = { show: true, target: r, message: '' }
}
function closeReject() {
  rejectModal.value.show = false
  rejectModal.value.message = ''
  rejectModal.value.target = null
}
async function confirmReject() {
  const t = rejectModal.value.target
  if (!t) return
  await rejectReview(t.reviewId, rejectModal.value.message)
  closeReject()
}

async function approveReview(r) {
  const prev = r.status
  r.status = 'APPROVED' // 낙관적 업데이트
  try {
    if (USE_MOCK) {
      await decideReview(r.reviewId, 'APPROVED', '심사가 완료되었습니다. 축하드립니다!')
    } else {
      await fetch(`/api/review/admin/${encodeURIComponent(r.reviewId)}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          status: 'APPROVED',
          message: '심사가 완료되었습니다. 축하드립니다!',
        }),
      })
    }
    fetchReviews()
  } catch (e) {
    r.status = prev
  }
}

async function rejectReview(reviewId, message) {
  if (USE_MOCK) {
    await decideReview(reviewId, 'REJECTED', message)
  } else {
    await fetch(`/api/review/admin/${encodeURIComponent(reviewId)}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: 'REJECTED', message }),
    })
  }
  fetchReviews()
}

/** ✅ 롤백: APPROVED/REJECTED -> PENDING */
async function revertToPending(r) {
  const prev = r.status
  r.status = 'PENDING' // 낙관적 업데이트
  try {
    if (USE_MOCK) {
      await decideReview(r.reviewId, 'PENDING', '')
    } else {
      await fetch(`/api/review/admin/${encodeURIComponent(r.reviewId)}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'PENDING', message: '' }),
      })
    }
    fetchReviews()
  } catch (e) {
    r.status = prev
  }
}

/** ✅ 목 데이터 초기화 */
async function resetMockData() {
  if (!USE_MOCK) return
  await resetMock()
  page.value = 1
  q.value = ''
  filterStatus.value = null
  await fetchReviews()
}

watch([filterStatus, page, size], () => {}, { deep: true })

onMounted(() => {
  if (USE_MOCK) ensureMockSeed()
  fetchReviews()
})
</script>

<style scoped>
.input {
  @apply w-full h-10 px-3 rounded-xl border border-subtle-border bg-base-bg focus:outline-none focus:ring-2 focus:ring-brand-accent;
}

/* iOS/모바일 웹앱 UX */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
