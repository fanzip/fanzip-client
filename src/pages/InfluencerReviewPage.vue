<template>
  <div class="min-h-screen bg-subtle-bg text-text-base font-sans">
    <!-- Top Bar -->
    <header class="sticky top-0 z-10 bg-base-bg/90 backdrop-blur border-b border-nav-stroke">
      <div class="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        <h1 class="text-lg font-bold">인플루언서 심사</h1>
      </div>
    </header>

    <!-- Progress -->
    <section class="max-w-5xl mx-auto px-5 pt-6">
      <ol class="flex items-center gap-6">
        <li class="flex items-center gap-2">
          <span
            class="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary text-text-base text-xs font-bold"
            >1</span
          >
          <span class="text-sm font-semibold text-nav-active">온보딩</span>
        </li>
        <li class="flex items-center gap-2">
          <span
            class="flex items-center justify-center w-6 h-6 rounded-full border border-brand-primary text-xs font-bold"
            >2</span
          >
          <span class="text-sm font-semibold text-nav-active">심사</span>
        </li>
        <li class="flex items-center gap-2">
          <span
            class="flex items-center justify-center w-6 h-6 rounded-full border border-subtle-border text-xs font-bold"
            >3</span
          >
          <span class="text-sm text-subtle-text">완료</span>
        </li>
      </ol>
    </section>

    <!-- Body -->
    <main class="max-w-5xl mx-auto px-5 py-6 space-y-6">
      <!-- 1) 심사 신청(메인 섹션) -->
      <section>
        <div
          class="bg-base-bg rounded-2xl shadow-sm border border-subtle-border p-6 md:p-7 space-y-5 break-words"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 class="text-xl md:text-2xl font-bold">심사 신청</h2>
              <p class="text-sm text-subtle-text mt-1">
                기본 정보만 제출하면 운영팀이 확인 후 승인해요.
              </p>
            </div>

            <!-- 상태/초안 뱃지 -->
            <!-- 심사 상태가 있을 때 -->
            <span
              v-if="status !== 'NONE'"
              class="inline-flex items-center h-6 px-2.5 rounded-full border text-[11px] gap-1"
              :class="statusBadge.cls"
            >
              <span
                class="inline-block w-1.5 h-1.5 rounded-full"
                :class="{
                  'bg-yellow-500': status === 'PENDING',
                  'bg-green-600': status === 'APPROVED',
                  'bg-red-600': status === 'REJECTED',
                }"
              />
              {{ statusBadge.text }}
            </span>
          </div>

          <!-- Form -->
          <form class="space-y-4" @submit.prevent="submit">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-subtle-text mb-2">활동명(닉네임)</label>
                <input
                  v-model.trim="form.nickname"
                  class="input"
                  placeholder="예) 홍길동"
                  required
                />
              </div>
              <div>
                <label class="block text-xs text-subtle-text mb-2">카테고리</label>
                <select v-model="form.category" class="input">
                  <option value="BEAUTY">뷰티</option>
                  <option value="GAME">게임</option>
                  <option value="DAILY">일상</option>
                  <option value="FASHION">패션</option>
                  <option value="COOKING">요리</option>
                  <option value="HEALTH">다이어트/건강</option>
                  <option value="PET">반려동물</option>
                  <option value="KIDS">키즈</option>
                  <option value="EDUCATION">교육/지식</option>
                  <option value="TRAVEL">여행</option>
                  <option value="MUSIC">음악</option>
                  <option value="FITNESS">운동</option>
                  <option value="SPORTS">스포츠</option>
                  <option value="LANGUAGE">언어</option>
                  <option value="ETC">기타</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-xs text-subtle-text mb-2">대표 SNS 링크</label>
              <input
                v-model.trim="form.snsLink"
                class="input"
                placeholder="https://instagram.com/yourid"
                type="url"
              />
            </div>
            <div>
              <label class="block text-xs text-subtle-text mb-2">간단 소개</label>
              <textarea
                v-model.trim="form.intro"
                class="input min-h-28"
                placeholder="활동 내용과 커뮤니티를 소개해주세요."
              />
            </div>

            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p class="text-xs text-subtle-text">
                제출 후 결과는 보통 영업일 기준 1~3일 내 안내돼요.
              </p>
              <div class="flex justify-end">
                <button
                  type="submit"
                  class="btn btn-primary h-10 px-5 w-auto min-w-0"
                  :disabled="isSubmitting"
                >
                  <span v-if="!isSubmitting">심사 신청</span>
                  <span v-else>제출 중...</span>
                </button>
              </div>
            </div>

            <!-- 상태 메시지 -->
            <div
              v-if="status !== 'NONE'"
              class="rounded-xl border border-subtle-border bg-subtle-bg p-4"
            >
              <p class="text-sm">
                현재 상태: <strong>{{ status }}</strong>
                <span v-if="reviewedAt" class="text-subtle-text"> · {{ reviewedAt }}</span>
              </p>
              <p v-if="message" class="text-sm mt-1">메시지: {{ message }}</p>
            </div>
          </form>
        </div>
      </section>

      <!-- 2) 가이드 & 문의(하단 섹션) -->
      <section>
        <div class="grid md:grid-cols-2 gap-5">
          <div
            class="bg-base-bg rounded-2xl shadow-sm border border-subtle-border p-5 min-w-0 break-words"
          >
            <h3 class="text-sm font-bold mb-3">제출 가이드</h3>
            <ul class="list-disc pl-5 text-sm space-y-2 text-subtle-text">
              <li>활동명은 팬들이 알고 있는 이름으로 작성</li>
              <li>SNS 링크는 공개 계정으로 등록</li>
              <li>본인 확인을 위해 DM 수신 가능 상태 권장</li>
            </ul>
          </div>
          <div
            class="bg-base-bg rounded-2xl shadow-sm border border-subtle-border p-5 min-w-0 break-words"
          >
            <h3 class="text-sm font-bold mb-3">문의</h3>
            <div class="space-y-3 text-sm text-subtle-text">
              <p>승인 결과는 푸시 · 이메일로 안내돼요</p>
              <p>메일 문의: fanzip_devteam@gmail.com</p>
              <p class="text-[11px] text-subtle-text">
                현재 작성 중인 정보가 함께 전달되어 빠르게 도와드려요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const successNotice = ref(false)
const USE_MOCK = true

// form & 상태
const form = reactive({ nickname: '', category: 'BEAUTY', snsLink: '', intro: '' })
const status = ref('NONE') // NONE | PENDING | APPROVED | REJECTED
const message = ref('')
const reviewedAt = ref('')
const isSubmitting = ref(false)
const isChatting = ref(false)

function goPending() {
  router.push('/review/pending')
}

// 상태 뱃지 매핑(심사 상태일 때만 사용)
const statusBadge = computed(() => {
  const map = {
    NONE: { text: '초안', cls: 'bg-subtle-bg border-subtle-border text-subtle-text' },
    PENDING: {
      text: '검토 대기',
      cls: 'bg-brand-primary/10 border-brand-primary/30 text-nav-active',
    },
    APPROVED: { text: '승인됨', cls: 'bg-green-50 border-green-200 text-green-700' },
    REJECTED: { text: '거절됨', cls: 'bg-red-50 border-red-200 text-red-700' },
  }
  return map[status.value] || map.NONE
})

// 초안 뱃지 렌더링 조건(아무 입력 없으면 숨김)
const draftMode = computed(() => {
  return !!(
    form.nickname ||
    form.snsLink ||
    form.intro ||
    (form.category && form.category !== 'BEAUTY')
  )
})

// 초안 저장 시간 표시
const draftSavedAt = ref('')
function loadDraftTimestamp() {
  const iso = localStorage.getItem('reviewDraftSavedAt')
  if (!iso) return
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  draftSavedAt.value = `${hh}:${mm}`
}

// 초안 자동 저장
watch(
  form,
  (val) => {
    localStorage.setItem('reviewDraft', JSON.stringify(val))
    localStorage.setItem('reviewDraftSavedAt', new Date().toISOString())
    loadDraftTimestamp()
  },
  { deep: true },
)

async function fetchMyStatus() {
  try {
    const res = await fetch('/api/review/my', { credentials: 'include' })
    if (!res.ok) return
    const data = await res.json()
    status.value = data.status || 'NONE'
    message.value = data.message || ''
    reviewedAt.value = data.reviewedAt || ''
  } catch (_) {}
}

async function submit() {
  if (!form.nickname) return alert('활동명을 입력해주세요')
  isSubmitting.value = true

  status.value = 'PENDING'
  message.value = ''
  reviewedAt.value = ''
  localStorage.removeItem('reviewDraft')
  localStorage.removeItem('reviewDraftSavedAt')
  draftSavedAt.value = ''

  alert('제출이 완료되었습니다.')

  router.replace('/review/pending')

  try {
    fetch('/api/review/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    }).catch(() => {})
  } finally {
    isSubmitting.value = false
  }
}

// 시급 문의 → 티켓 생성 후 채팅방으로 이동
async function openUrgentChat() {
  try {
    isChatting.value = true
    const payload = {
      type: 'INFLUENCER_REVIEW',
      title: '[시급문의] 인플루언서 심사',
      sourcePath: location.pathname,
      status: status.value,
      reviewedAt: reviewedAt.value || null,
      message: message.value || null,
      formSnapshot: {
        nickname: form.nickname,
        category: form.category,
        snsLink: form.snsLink,
        intro: form.intro,
      },
    }
    const res = await fetch('/api/support/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const data = await res.json().catch(() => ({}))
      const chatRoomId = data.chatRoomId || data.ticketId
      if (chatRoomId) return router.push(`/support/chat/${encodeURIComponent(chatRoomId)}`)
    }
    router.push('/support/chat?topic=review')
  } catch (_) {
    router.push('/support/chat?topic=review')
  } finally {
    isChatting.value = false
  }
}

onMounted(() => {
  const draft = localStorage.getItem('reviewDraft')
  if (draft) Object.assign(form, JSON.parse(draft))
  loadDraftTimestamp()
  fetchMyStatus()
})
</script>

<style scoped>
.input {
  @apply w-full h-10 px-3 rounded-xl border border-subtle-border bg-base-bg focus:outline-none focus:ring-2 focus:ring-brand-accent;
}
</style>
