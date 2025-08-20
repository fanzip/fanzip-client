<script setup>
import { ref, computed, toValue, onMounted } from 'vue'

import influencerApi from '@/api/influencerApi'
import SearchBar from '@/components/common/SearchBar.vue'
import InfluencerIntro from '@/components/influencer/InfluencerIntro.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import InfluencerCard from '@/components/influencer/InfluencerCard.vue'
import AppNav from '@/components/layout/AppNav.vue'
import userApi from '@/api/userApi'
import { useAuthStore } from '@/stores/authStore'

/* ----------------------- FCM SDK ----------------------- */
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'

/** Firebase 프로젝트 설정 */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB2bwId50fvnuZ_vuq-F1SerhJ3zBxOu5A",
  authDomain: "fanzip-6a8c8.firebaseapp.com",
  projectId: "fanzip-6a8c8",
  storageBucket: "fanzip-6a8c8.firebasestorage.app",
  messagingSenderId: "301381375917",
  appId: "1:301381375917:web:35da5fbba909f40ab5f324",
  measurementId: "G-88Q2F5HKJK"
}

/** FCM Web Push 공개키(VAPID) - FCM 콘솔 > 프로젝트 설정 > 클라우드 메시징 */
const VAPID_PUBLIC_KEY =
  'BN6vmOR_G-wgabe0XCT_Bk9jf9CzvlgxLZ3eE9x2uAVz9oE6ZispnS_VjDLLZKraHnxXI7UHQ0GKHChAFMD1L3s'

const authStore = useAuthStore()

const searchBarRef = ref(null)
const influencers = ref([])

/* ----------------------- 안전한 알림 허용 패턴 ----------------------- */
// 로컬 키(버전 붙여서 이후 스펙 변경 시 구분)
const NOTI_KEY = 'notiAsked.v1'

// 로그인 여부 (스토어 구조를 모를 수 있으니 유연하게 체크)
const isLoggedIn = computed(() => {
  return Boolean(
    authStore?.isLoggedIn ||
      authStore?.user?.id ||
      authStore?.profile?.id ||
      authStore?.accessToken,
  )
})

// 모달/바텀시트 표시
const showNotiPrompt = ref(false)

// 환경이 알림을 “물어볼 수 있는” 상태인지
function canAskNotification() {
  // 브라우저 지원
  if (!('Notification' in window)) return false
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

  // 보안 컨텍스트(https 또는 localhost)
  const isSecure = window.isSecureContext || location.protocol === 'https:'
  if (!isSecure) return false

  // 이미 결정됨(허용/거부)
  if (Notification.permission !== 'default') return false

  // 이전에 우리 UI로 물어본 적 있음
  if (localStorage.getItem(NOTI_KEY) === '1') return false

  // 로그인 상태에서만
  if (!isLoggedIn.value) return false

  return true
}

// (클릭 시) 브라우저 권한 요청
async function requestNotificationPermission() {
  try {
    const result = await Notification.requestPermission()
    localStorage.setItem(NOTI_KEY, '1') // 한 번 물어봤으면 다시 안 묻기
    showNotiPrompt.value = false

    if (result === 'granted') {
      await registerPush() // 권한 승인 시에만 FCM 토큰 발급/등록
    }
  } catch (e) {
    console.error('Notification permission error:', e)
    showNotiPrompt.value = false
  }
}

/* ----------------------- FCM 토큰 발급 + 서버 전송 ----------------------- */
let firebaseApp /*: FirebaseApp*/ = null
let messaging /*: Messaging*/ = null

async function ensureFirebase() {
  if (!firebaseApp) firebaseApp = initializeApp(FIREBASE_CONFIG)
  if (!messaging) messaging = getMessaging(firebaseApp)
}

/**
 * 서비스워커 등록 + FCM 토큰 발급 + 서버 전송
 * - /sw.js 를 Messaging SW로 사용 (이미 FCM compat 코드가 들어있음)
 * - iOS/Safari 등 미지원 환경은 조용히 skip
 */
async function registerPush() {
  try {
    // 1) 서비스워커 등록 (루트 경로)
    const reg = await navigator.serviceWorker.register('/firebase/firebase-messaging-sw.js')
    await navigator.serviceWorker.ready

    // 2) FCM 지원 여부 (사파리/일부 브라우저에서 false)
    if (!(await isSupported())) {
      console.warn('FCM not supported in this browser.')
      return
    }

    // 3) Firebase Messaging 준비
    await ensureFirebase()

    // 4) FCM 토큰 발급 (VAPID 공개키 + 우리가 등록한 SW를 명시)
    if (!VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY.startsWith('<PUT_')) {
      console.warn('VAPID_PUBLIC_KEY 미설정: FCM 토큰을 발급할 수 없습니다.')
      return
    }

    const token = await getToken(messaging, {
      vapidKey: VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: reg,
    })

    if (!token) {
      console.warn('No FCM token (permission denied or unsupported).')
      return
    }

    // 5) 서버에 토큰 전달(유저 식별 포함). 필요한 파라미터는 백엔드 규약에 맞게!
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 세션/쿠키 사용 시
      body: JSON.stringify({
        token,
        // userId: authStore?.user?.id, // 필요 시 식별자 포함
        // deviceInfo: navigator.userAgent,
      }),
    })

    // 6) (선택) 포그라운드 메시지 핸들링: 토스트 등으로 표시 가능
    onMessage(messaging, (payload) => {
      console.log('[FCM foreground]', payload)
      // TODO: 원하는 UI로 노출(Toast 등)
    })
  } catch (e) {
    console.error('registerPush error:', e)
  }
}

/* ----------------------- 데이터 로딩 ----------------------- */
onMounted(async () => {
  try {
    const res = await userApi.getUserInfo()
    authStore.setUserInfo(res.data)
  } catch (e) {
    console.error(e)
  }

  // 로그인 정보 세팅이 끝난 뒤에 조건 확인
  if (canAskNotification()) {
    // ❗ 자동 요청 금지: UI만 띄우고 버튼 클릭에서 requestPermission 호출
    showNotiPrompt.value = true
  }

  try {
    const data = await influencerApi.fetchAll()
    influencers.value = data
  } catch (e) {
    console.error('인플루언서 목록 불러오기 실패', e)
  }
})

/* ----------------------- 검색 필터 ----------------------- */
const filteredInfluencers = computed(() => {
  const keyword = toValue(searchBarRef.value?.keyword) || ''
  if (!keyword) return influencers.value
  return influencers.value.filter((influencer) =>
    influencer.influencerName.toLowerCase().includes(keyword.toLowerCase()),
  )
})
</script>

<template>
  <div class="bg-base-bg min-h-screen flex flex-col">
    <AppHeader type="logo" />
    <InfluencerIntro />
    <SearchBar ref="searchBarRef" class="mb-1" />

    <div class="bg-subtle-bg flex-grow">
      <div class="w-full box-border px-5">
        <template v-if="filteredInfluencers.length > 0">
          <div class="grid grid-cols-2 gap-4 mt-2 pb-20">
            <InfluencerCard
              v-for="inf in filteredInfluencers"
              :key="inf.influencerId"
              :id="inf.influencerId"
              :name="inf.influencerName"
              :profileImage="inf.profileImage"
              :coverImage="inf.profileImage"
              :description="inf.description"
            />
          </div>
        </template>

        <template v-else>
          <div class="flex justify-center items-center h-60">
            <p class="text-gray-400 text-base">검색 결과가 없습니다.</p>
          </div>
        </template>
      </div>
    </div>

    <AppNav />

    <!-- 🔔 알림 허용 모달/바텀시트 (로그인 후 최초 진입 시 한 번만) -->
    <div
      v-if="showNotiPrompt"
      class="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50"
      @click.self="showNotiPrompt = false; localStorage.setItem('notiAsked.v1','1')"
    >
      <div class="w-full md:max-w-sm bg-base-bg rounded-t-2xl md:rounded-2xl p-4 shadow-xl">
        <h3 class="font-semibold mb-2">알림을 받아보시겠어요?</h3>
        <p class="text-sm text-subtle-text mb-4">주문 상태와 멤버십 소식을 푸시로 알려드려요.</p>
        <div class="flex gap-2">
          <button
            class="flex-1 h-10 rounded-xl border border-subtle-border"
            @click="showNotiPrompt = false; localStorage.setItem('notiAsked.v1','1')"
          >
            나중에
          </button>
          <button
            class="flex-1 h-10 rounded-xl bg-brand-primary text-base"
            @click="requestNotificationPermission"
          >
            알림 허용
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
