// src/fcm-init.js
import { requestFcmToken, bindForegroundMessage } from '@/firebase'

let booted = false
let messageHandlerBound = false
const LAST_KEY = 'last_sent_fcm_token'

/**
 * 로그인 성공 직후 또는 앱 부팅 시(이미 access-token 있으면) 호출
 *  - 앱 SW( vite-plugin-pwa )가 ready 된 registration을 사용해 FCM 토큰 발급
 *  - 성공 시에만 last_sent_fcm_token 저장
 */
export async function initFcm({ force = false, registration: registrationArg } = {}) {
  try {
    if (booted && !force) return
    if (!('serviceWorker' in navigator)) {
      console.warn('[FCM] serviceWorker not supported'); return
    }

    const access = localStorage.getItem('access-token')
    if (!access) { console.warn('[FCM] no access-token, skip'); return }

    // 1) 기존 앱 SW registration 사용 (중복 등록 금지)
    const registration =
      registrationArg ||
      (await navigator.serviceWorker.ready) // vite-plugin-pwa가 등록한 SW가 활성화될 때까지 대기
    if (!registration?.active) {
      console.warn('[FCM] SW not active yet, skip'); return
    }
    console.log('[FCM] using SW:', registration.scope)

    // 2) 권한 요청 (이미 granted면 재요청 안 함)
    let perm = Notification.permission
    if (perm === 'default') perm = await Notification.requestPermission()
    if (perm !== 'granted') { console.warn('[FCM] permission not granted'); return }

    // 3) 토큰 발급 (앱 SW registration을 명시적으로 전달)
    const vapid = import.meta.env.VITE_FIREBASE_VAPID_KEY
    if (!vapid) { console.error('[FCM] VITE_FIREBASE_VAPID_KEY missing'); return }

    const token = await requestFcmToken(vapid, registration)
    console.log('[FCM] token:', token)
    if (!token) { console.warn('[FCM] no token retrieved'); return }

    // 4) 서버 등록 (변경 있을 때만; 타임아웃 방지용 AbortController)
    const base = import.meta.env.VITE_API_BASE_URL
    if (!base) { console.error('[FCM] VITE_API_BASE_URL missing'); return }

    if (force || localStorage.getItem(LAST_KEY) !== token) {
      const qs = new URLSearchParams({ token, deviceType: 'WEB' }).toString()
      const ac = new AbortController()
      const t = setTimeout(() => ac.abort(), 7000)

      const res = await fetch(`${base}/api/notifications/token?${qs}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access}` },
        signal: ac.signal
      }).catch((e) => {
        if (e.name === 'AbortError') throw new Error('register timeout')
        throw e
      })
      clearTimeout(t)

      console.log('[FCM] register status:', res?.status)
      if (!res || !res.ok) {
        const text = res ? await res.text().catch(() => '') : ''
        throw new Error(`register failed ${res?.status ?? 'NO_RES'} ${text}`)
      }
      localStorage.setItem(LAST_KEY, token)
    }

    // 5) 포그라운드 알림 핸들링 (중복 바인딩 방지 + 2초 쓰로틀)
    if (!messageHandlerBound) {
      let lastNotificationTime = 0
      const NOTIFICATION_THROTTLE = 2000

      bindForegroundMessage((payload) => {
        const now = Date.now()
        if (now - lastNotificationTime < NOTIFICATION_THROTTLE) {
          console.log('[FCM] throttled notification')
          return
        }
        lastNotificationTime = now

        const title = payload.notification?.title || '알림'
        const body = payload.notification?.body || ''
        const url = payload.fcmOptions?.link || payload.data?.targetUrl || '/'

        if (document.visibilityState === 'visible' && Notification.permission === 'granted') {
          const n = new Notification(title, {
            body,
            icon: '/logo.svg',
            badge: '/logo.svg',
            tag: 'fanzip-notification'
          })
          n.onclick = () => {
            window.focus()
            if (url && url !== '/') window.location.href = url
            n.close()
          }
        } else {
          console.log('[FCM] page hidden or permission not granted; skip foreground Notification')
        }
      })
      messageHandlerBound = true
      console.log('[FCM] foreground message handler bound')
    }

    booted = true
  } catch (e) {
    console.error('[FCM] init error:', e)
  }
}

/** 테스트/재전송용: 마지막 전송 토큰 리셋 */
export function resetLastSentFcmToken() {
  localStorage.removeItem(LAST_KEY)
}
